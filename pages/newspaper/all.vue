<script setup lang="ts">
interface Article {
  title: string;
  link: string;
  description: string;
  author: string;
  pubDate: string;
}

const {
  data: articles,
  pending,
  error,
} = await useFetch("/api/rss/all", {
  key: "fetchAllArticles",

  server: false,
  cache: "no-cache",

  transform: async (data: Blob): Promise<Article[]> => {
    if (!(data instanceof Blob)) {
      console.error("Unerwartete Daten empfangen, erwarte Blob.", data);
      return [];
    }

    const xmlString = await data.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");

    if (doc.querySelector("parsererror")) {
      console.error("Fehler beim Parsen des XML-Feeds.", xmlString);
      return [];
    }

    return Array.from(doc.querySelectorAll("item")).map((item) => {
      const getText = (selector: string) =>
        item.querySelector(selector)?.textContent || "";

      return {
        title: getText("title"),
        link: getText("link"),
        description: getText("description"),
        author: getText("author") || getText("dc\\:creator"),
        pubDate: getText("pubDate"),
      };
    });
  },
});

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <UContainer>
    <h1 class="text-3xl font-bold my-8">Aggregierte Nachrichten</h1>

    <div v-if="pending" class="text-center">
      <p>Lade Nachrichten...</p>
    </div>

    <div v-else-if="error">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        title="Fehler beim Laden der Nachrichten"
        :description="error.message"
      />
    </div>

    <div v-else class="space-y-4">
      <UCard v-for="(article, index) in articles" :key="index">
        <template #header>
          <NuxtLink
            :to="article.link"
            target="_blank"
            class="text-xl font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            {{ article.title }}
          </NuxtLink>
        </template>

        <p class="text-gray-600 dark:text-gray-300">
          {{ article.description }}
        </p>

        <template #footer>
          <div
            class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400"
          >
            <span>{{ article.author }}</span>
            <span>{{ formatDate(article.pubDate) }}</span>
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>