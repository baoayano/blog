// Import necessary types and functions
import { db } from '../lib/firebase-admin';
import { getCollection } from "astro:content";

// Import necessary types
import type { DocumentData } from "firebase-admin/firestore";

/*
    * Get the list of blog posts from the "blog" collection in Astro's content system.
    * @returns {Promise<CollectionEntry<"blog">[]>} - A promise that resolves to an array of blog posts.
*/
export async function getPostList() {
    const posts = await getCollection("blog");
    return posts;
}

/*
    * Formats a string based on the provided parameters.
    * @param {string} str - The string to format.
    * @param {boolean} isPostId - A flag indicating whether the string is a post ID.
    * @returns {string} - The formatted string.
*/
export function formatString(str: string, isPostId: boolean): string {
    if (!str) return '';
    if (isPostId) return str.trim().toLowerCase().replace(/\s+/g, '-');
    return str.trim();
}

/*
    * Creates a response with an error message and status code.
    * @param {string} message - The error message.
    * @param {number} status - The HTTP status code.
    * @returns {Response} - The response object.
*/
export function responseWithError(message: string, status: number) {
    return new Response(JSON.stringify({ message }), {
        headers: { 'Content-Type': 'application/json' },
        status
    });
}

/*
    * Handles the verification of a request using Cloudflare Turnstile.
    * @param {Object} data - The data containing the Turnstile response.
    * @param {string} data['cf-turnstile-response'] - The Turnstile response token.
    * @returns {Promise<boolean>} - A promise that resolves to true if the verification is successful, otherwise false.
*/
export async function handleVerification(data: { 'cf-turnstile-response': string }): Promise<boolean> {
    const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;
    const cfTurnstile = data['cf-turnstile-response'];
    if (!cfTurnstile) return false;

    const verificationResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: cfTurnstile,
            }),
        }
    );

    const result = await verificationResponse.json();
    return result.success ?? false;
}

/*
    * Checks if the request exceeds the rate limit based on the IP address.
    * @param {Request} request - The incoming request object.
    * @returns {Promise<boolean>} - A promise that resolves to true if the request is allowed, otherwise false.
*/
export async function rateLimiting(request: Request): Promise<boolean> {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || '';
    const isLocalhost = request.headers.get('host')?.includes('localhost') || request.headers.get('host')?.includes('127.0.0.1');
    if (isLocalhost) return true; // Skip rate limiting for localhost
    if (!ip) return false;
    
    const docRef = await db.collection('rateLimit').doc(ip).get();

    if (docRef.exists) {
        const last = docRef.data()?.lastCommentAt ?? 0;

        if (Date.now() - last < 30000) { // 30 seconds
            return false; // Rate limit exceeded
        }
    }

    await db.collection('rateLimit').doc(ip).set({ lastCommentAt: Date.now() });

    return true; // Rate limit not exceeded
}

/*
    * Saves a comment to the Firestore database.
    * @param {Object} commentData - The comment data to save.
    * @param {string} commentData.postId - The ID of the post the comment belongs to.
    * @param {string} commentData.name - The name of the commenter.
    * @param {string} commentData.comment - The content of the comment.
    * @returns {Promise<boolean>} - A promise that resolves to true if the comment was saved successfully, otherwise false.
*/
export async function saveCommentToFirestore(commentData: {
    postId: string;
    name: string;
    comment: string
}): Promise<boolean> {
    try {
        await db.collection('comments').add({
            postId: commentData.postId,
            name: commentData.name,
            comment: commentData.comment,
            createdAt: Date.now(),
        });
        return true;
    } catch (error) {
        console.error('Error saving comment to Firestore:', error);
        return false;
    }
}

/*
    * Gets comments for a specific post based on its ID.
    * @param {string} postId - The ID of the post.
    * @param {boolean} isFullList - Whether to fetch the full list of comments.
    * @returns {Promise<DocumentData[]>} - A promise that resolves to an array of comment documents.
*/
export async function getCommentsByPostId(postId: string, isFullList: boolean = false): Promise<DocumentData[]> {
    try {
        const snapshot = await db.collection('comments')
            .where('postId', '==', postId)
            .orderBy('createdAt', 'desc')
            .offset(isFullList ? 5 : 0) // Adjust offset based on isFullList flag
            .limit(isFullList ? 100 : 5) // Adjust limit based on isFullList flag
            .get();
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching comments from Firestore:', error);
        return [];
    }
}