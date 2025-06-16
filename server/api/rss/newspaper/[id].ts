import { createClient } from "@supabase/supabase-js";
import RSS from "rss";

export default defineEventHandler(async (event) => {
  const newspaperIdParam = getRouterParam(event, "id");
  const newspaperId = parseInt(newspaperIdParam!, 10);

  if (isNaN(newspaperId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid ID" });
  }

  const config = useRuntimeConfig(event);
  const supabaseAdmin = createClient(
    config.supabaseUrl!,
    config.supabaseServiceKey!,
  );

  const { data: newspaperData, error: newspaperError } = await supabaseAdmin
    .from("newspaper")
    .select("name")
    .eq("id", newspaperId)
    .single();

  if (newspaperError || !newspaperData) {
    console.error(`Error fetching newspaper ${newspaperId}:`, newspaperError);
    throw createError({
      statusCode: 404,
      statusMessage: "Newspaper not found",
    });
  }

  let query = supabaseAdmin
    .from("parsed_news")
    .select(
      "title, link, snippet, published_at, author, content_html, image_url, categories",
    )
    .eq("newspaper_id", newspaperId);

  const { data: articles, error: articlesError } = await query
    .order("published_at", { ascending: false })
    .limit(50);

  if (articlesError) {
    console.error("Error fetching articles for newspaper:", articlesError);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not fetch articles for the newspaper",
    });
  }

  const feed = new RSS({
    title: `RSS Feed: ${newspaperData.name}`,
    description: `Die neuesten Nachrichten von "${newspaperData.name}".`,
    feed_url: `https://mnapps-vue.vercel.app//api/rss/newspaper/${newspaperId}`,
    site_url: "https://mnapps-vue.vercel.app/",
    language: "de",
  });

  for (const article of articles || []) {
    const feedItem: any = {
      title: article.title || "Ohne Titel",
      description: article.content_html || article.snippet || "",
      url: article.link,
      author: article.author || newspaperData.name || "Unbekannte Quelle",
      date: article.published_at,
      categories: article.categories || [],
    };

    if (article.image_url) {
      feedItem.enclosure = { url: article.image_url };
    }

    feed.item(feedItem);
  }

  const xml = feed.xml({ indent: true });
  setResponseHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return xml;
});