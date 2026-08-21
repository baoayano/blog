import type { CollectionEntry } from "astro:content";

export interface Props {
	title?: string;
	description?: string;
	image?: string;
	alternateHref?: string;
	lang?: Language;

	/**
	 * Custom canonical URL.
	 * Leave empty to use the current page URL.
	 */
	canonical?: string;

	/**
	 * Prevent search engines from indexing the page.
	 */
	noindex?: boolean;

	/**
	 * Use "article" for blog posts.
	 */
	type?: "website" | "article";

	author?: string;
	
	/**
	 * ISO 8601 date, for example:
	 * 2026-08-06T10:00:00+07:00
	 */
	publishedTime?: string;
	modifiedTime?: string;
}

export type Language = "vi" | "en";

export interface Comment {
	name: string;
	postId: string;
	comment: string;
	createdAt: number;
}

export type Blog = CollectionEntry<"blog">;