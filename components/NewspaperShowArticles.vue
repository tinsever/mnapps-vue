<script setup lang="ts">
const props = defineProps({
  paperId: {
    type: String,
    required: true,
  },
});

const visibleArticleCount = ref(3);

interface Article {
  title: string;
  link: string;
  snippet: string;
  htmlContent: string;
  author: string;
  pubDate: string;
  imageUrl: string | null;
  categories: string[];
}

interface ListData {
  listTitle: string;
  articles: Article[];
}

const createSnippet = (html: string, maxLength = 200): string => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

const { data, pending, error } = await useFetch(
  `/api/rss/newspaper/${props.paperId}`,
  {
    key: `list-articles-${props.paperId}`,
    server: false,
    cache: "no-cache",
    transform: async (rawData: unknown): Promise<ListData> => {
      if (!(rawData instanceof Blob)) {
        return { listTitle: "Fehler", articles: [] };
      }
      const xmlString = await rawData.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, "application/xml");
      if (doc.querySelector("parsererror")) {
        return { listTitle: "Parsing Fehler", articles: [] };
      }
      const listTitle =
        doc.querySelector("channel > title")?.textContent || "Unbenannte Liste";

      const articles = Array.from(doc.querySelectorAll("item")).map((item) => {
        const getText = (selector: string) =>
          item.querySelector(selector)?.textContent || "";
        const categories = Array.from(item.querySelectorAll("category")).map(
          (cat) => cat.textContent || "",
        );
        const imageUrl =
          item.querySelector("enclosure")?.getAttribute("url") || null;
        const htmlContent = getText("description");

        return {
          title: getText("title"),
          link: getText("link"),
          htmlContent: htmlContent,
          snippet: createSnippet(htmlContent),
          author: getText("author") || getText("dc\\:creator"),
          pubDate: getText("pubDate"),
          imageUrl: imageUrl,
          categories: categories,
        };
      });
      return { listTitle, articles };
    },
  },
);

const displayedArticles = computed(() => {
  if (!data.value) return [];
  return data.value.articles.slice(0, visibleArticleCount.value);
});

const showLoadMoreButton = computed(() => {
  return data.value && data.value.articles.length > visibleArticleCount.value;
});

const loadMore = () => {
  if (data.value) {
    visibleArticleCount.value = data.value.articles.length;
  }
};

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
  <div v-if="pending" class="space-y-4">
    <USkeleton v-for="i in 3" :key="i" class="h-48 w-full" />
  </div>
  <div v-else-if="error">
    <UAlert
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      title="Fehler beim Laden der Artikel"
      :description="error.message"
    />
  </div>
  <div v-else-if="data" class="space-y-6">
    <div v-if="data.articles.length === 0">
      <UAlert
        icon="i-heroicons-inbox"
        title="Diese Liste ist leer"
        description="Für die ausgewählten Zeitungen wurden noch keine Artikel gefunden."
      />
    </div>

    <div v-else class="space-y-4">
      <UCard
        v-for="(article, index) in displayedArticles"
        :key="index"
      >
        <div class="flex flex-col sm:flex-row">
          <div v-if="article.imageUrl" class="sm:w-1/3">
            <img
              :src="article.imageUrl"
              alt=""
              class="w-full h-48 sm:h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
            />
          </div>

          <!-- Content Section -->
          <div class="flex flex-col flex-1 p-4 sm:p-6">
            <NuxtLink
              :to="article.link"
              target="_blank"
              class="text-xl font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-2"
            >
              {{ article.title }}
            </NuxtLink>

            <p
              v-if="index < 3"
              class="text-gray-600 dark:text-gray-300 flex-1"
            >
              {{ article.snippet }}
            </p>
            <div
              v-else
              v-html="article.htmlContent"
              class="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none flex-1"
            ></div>

            <div class="mt-4">
              <div
                v-if="article.categories.length > 0"
                class="flex flex-wrap gap-2 mb-3"
              >
                <UBadge
                  v-for="category in article.categories"
                  :key="category"
                  color="neutral"
                  variant="soft"
                >
                  {{ category }}
                </UBadge>
              </div>
              <div
                class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{{ article.author }}</span>
                <span>{{ formatDate(article.pubDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- --- "LOAD MORE" BUTTON --- -->
    <div v-if="showLoadMoreButton" class="text-center">
      <UButton
        label="Weitere Artikel laden"
        size="lg"
        variant="soft"
        @click="loadMore"
      />
    </div>
  </div>
</template>