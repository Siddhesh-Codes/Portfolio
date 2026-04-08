import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateBlogContent(slug?: string) {
  revalidateTag("posts", { expire: 0 });
  revalidatePath("/blog");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}
