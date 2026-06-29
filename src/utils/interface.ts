import type { CollectionEntry } from "astro:content";

export interface Props {
	title?: string;
	description?: string;
	image?: string;
}

export interface Comment {
	name: string;
	postId: string;
	comment: string;
	createdAt: number;
}

export type Blog = CollectionEntry<"blog">;