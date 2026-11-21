import { notFound, redirect } from "next/navigation";

// Old per-category URLs now open the single gallery with that category selected.
export default async function GalleryCategory({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!["designs", "social", "banners", "appstore"].includes(category)) notFound();
  redirect(`/gallery?cat=${category}`);
}
