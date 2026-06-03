import type { CollectionEntry } from "astro:content";

export interface Props {
	title?: string;
	description?: string;
	image?: string;
}

export type Blog = CollectionEntry<"blog">;