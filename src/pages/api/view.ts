// Import necessary types and functions
import type { APIRoute, APIContext } from 'astro';
import { responseWithError, getCommentsByPostId, getPostList } from '../../utils/api';

// Prerendering is disabled for this API route
export const prerender = false;

export const GET: APIRoute = async ({ request }: APIContext) => {
    try {
        const url = new URL(request.url);
        const postId = url.searchParams.get('postId');
        const showAll = url.searchParams.get('showAll') === 'true';

        if (!postId) {
            return responseWithError('Missing post ID', 400);
        }

        const comments = await getCommentsByPostId(postId, showAll);
        return new Response(JSON.stringify({ comments }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Error handling GET request:', error);
        return responseWithError('Internal Server Error', 500);
    }
}