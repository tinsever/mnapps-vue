import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Article ID is required",
    });
  }

  const supabaseAdmin = createClient(
    config.supabaseUrl!,
    config.supabaseServiceKey!
  );

  const { data: article, error } = await supabaseAdmin
    .from("parsed_news")
    .select("*, newspaper(name)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw createError({
      statusCode: 404,
      statusMessage: "Article not found",
    });
  }

  return article;
});