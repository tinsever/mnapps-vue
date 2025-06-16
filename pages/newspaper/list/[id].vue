<script setup lang="ts">
interface Article {
  title: string;
  link: string;
  description: string;
  author: string;
  pubDate: string;
}

interface ListData {
  listTitle: string;
  articles: Article[];
}

const route = useRoute();
const listId = route.params.id as string;

const { data, pending, error } = await useFetch(`/api/rss/list/${listId}`, {
  key: `list-${listId}`,

  server: false,
  cache: "no-cache",

  transform: async (rawData: unknown): Promise<ListData> => {
    if (!(rawData instanceof Blob)) {
      console.error("Unerwartete Daten empfangen, erwarte Blob.", rawData);
      return { listTitle: "Fehler", articles: [] };
    }

    const xmlString = await rawData.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");

    if (doc.querySelector("parsererror")) {
      console.error("Fehler beim Parsen des XML-Feeds.", xmlString);
      return { listTitle: "Parsing Fehler", articles: [] };
    }

    const listTitle =
      doc.querySelector("channel > title")?.textContent || "Unbenannte Liste";

    const articles = Array.from(doc.querySelectorAll("item")).map((item) => {
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

    return { listTitle, articles };
  },
});

useHead({
  title: data.value?.listTitle || "Nachrichtenliste",
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
  <UContainer class="py-8">
    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-8 w-1/2" />
      <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
    </div>

    <div v-else-if="error">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="soft"
        title="Liste nicht gefunden"
        :description="error.message"
      />
      <UButton to="/newspaper/all" class="mt-4">Zurück zur Übersicht</UButton>
    </div>

    <div v-else-if="data" class="space-y-6">
      <h1 class="text-3xl font-bold">{{ data.listTitle }}</h1>

      <div v-if="data.articles.length === 0">
        <UAlert
          icon="i-heroicons-inbox"
          title="Diese Liste ist leer"
          description="Für die ausgewählten Zeitungen wurden noch keine Artikel gefunden."
        />
      </div>

      <div v-else class="space-y-4">
        <UCard v-for="(article, index) in data.articles" :key="index">
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
    </div>
  </UContainer>
</template>