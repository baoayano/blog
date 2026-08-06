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
        if (!isHuman)
            return responseWithError('prove u are human please', 400);

        const { postId, name, comment } = data;
        const formattedFormData = {
            postId: formatString(postId, true),
            name: formatString(name, false),
            comment: formatString(comment, false)
        }

        const postList: Blog[] = await getPostList();

        if (!formattedFormData.postId || !formattedFormData.name || !formattedFormData.comment)
            return responseWithError('fill all please!!!!', 400);

        if (!postList.some(post => post.id === formattedFormData.postId))
            return responseWithError('u trying to nuke my database leh?', 400);

        if (formattedFormData.name.length < 3)
            return responseWithError('can you write a longer name pls', 400);

        if (formattedFormData.name.length > 50)
            return responseWithError('wow, what a crazy name :aiosima:', 400);

        if (formattedFormData.comment.length < 2)
            return responseWithError('too short, write more xD', 400);

        if (formattedFormData.comment.length > 250)
            return responseWithError('wtf is wrong with ur comment :sob:', 400);

        const isAllowed = await rateLimiting(request);
        if (!isAllowed) {
            return responseWithError(
                'bro gonna nuke the comment section by spamming api lolololol'
            , 429);
        }

        const isSaved = await saveCommentToFirestore(formattedFormData);
        if (!isSaved) {
            return responseWithError(
                'ummm there\'s an error while i try to save ur comment, try again later'
            , 500);
        }

        return responseWithError('comment failed to post (jk)', 200);
    } catch (error) {
        console.error('Error processing comment:', error);
        return responseWithError('crazy error happened, contact me to report it', 400);
    }
}