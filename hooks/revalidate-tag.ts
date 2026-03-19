import { revalidateTag } from "next/cache";
import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	GlobalAfterChangeHook,
} from "payload";

export const revalidateAfterChange =
	(...tags: string[]): CollectionAfterChangeHook =>
	({ doc }) => {
		for (const tag of tags) revalidateTag(tag, "max");
		return doc;
	};

export const revalidateAfterDelete =
	(...tags: string[]): CollectionAfterDeleteHook =>
	({ doc }) => {
		for (const tag of tags) revalidateTag(tag, "max");
		return doc;
	};

export const revalidateGlobalAfterChange =
	(...tags: string[]): GlobalAfterChangeHook =>
	({ doc }) => {
		for (const tag of tags) revalidateTag(tag, "max");
		return doc;
	};
