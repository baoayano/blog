// Import necessary types and functions
import type { APIRoute, APIContext } from 'astro';
import type { Blog } from "../../utils/interface";
import {
    getPostList,
    formatString,
    responseWithError,
    handleVerification,
    rateLimiting,
    saveCommentToFirestore
} from "../../utils/api";

// Prerendering is disabled for this API route
export const prerender = false;

export const GET: APIRoute = async ({ request }: APIContext) => {
    // Redirect to home page
    const url = new URL('/', request.url);
    return Response.redirect(url, 302);
}

export const POST: APIRoute = async ({ request }: APIContext) => {
    try {
        const data = await request.json();

        const isHuman = await handleVerification(data);
        if (!isHuman) {
            return responseWithError('Unauthorized', 400);
        }

        const { postId, name, comment } = data;
        const formattedFormData = {
            postId: formatString(postId, true),
            name: formatString(name, false),
            comment: formatString(comment, false)
        }

        const postList: Blog[] = await getPostList();

        if (!formattedFormData.postId || !formattedFormData.name || !formattedFormData.comment) {
            return responseWithError('Missing required fields', 400);
        }

        if (!postList.some(post => post.id === formattedFormData.postId)) {
            return responseWithError('Invalid post ID', 400);
        }

        if (formattedFormData.name.length < 3 || formattedFormData.name.length > 50) {
            return responseWithError('Name is too short or too long', 400);
        }

        if (formattedFormData.comment.length < 2 || formattedFormData.comment.length > 500) {
            return responseWithError('Comment is too short or too long', 400);
        }

        const isAllowed = await rateLimiting(request);
        if (!isAllowed) {
            return responseWithError('Rate limit exceeded. Please wait before posting again.', 429);
        }

        const isSaved = await saveCommentToFirestore(formattedFormData);
        if (!isSaved) {
            return responseWithError('Failed to save comment', 500);
        }

        // Process the comment data here
        return responseWithError('Comment posted successfully!', 200);
    } catch (error) {
        console.error('Error processing comment:', error);
        return responseWithError('Invalid JSON data', 400);
    }
}