<script setup lang="ts">
import type { Database } from "~/types/supabase";

type ArticleWithNewspaper = Database["public"]["Tables"]["parsed_news"]["Row"] & {
  newspaper: {
    name: string | null;
  } | null;
};

const route = useRoute();
const articleId = route.params.id as string;

const { data: article, error } = await useFetch<ArticleWithNewspaper>(
  `/api/articles/${articleId}`,
  {
    key: `article-${articleId}`,
  }
);

const formattedDate = computed(() => {
  if (!article.value?.published_at) return "";
  return new Date(article.value.published_at).toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

useHead({
  title: article.value?.title || "Artikel",
});
</script>

<template>
  <UContainer class="py-8">
    <div v-if="error">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        title="Artikel nicht gefunden"
        :description="error.message"
      />
      <UButton to="/newspaper/all" class="mt-4">Zurück zur Übersicht</UButton>
    </div>

    <div v-else-if="article">
      <UBreadcrumb
        :links="[
          { label: 'Home', to: '/' },
          { label: 'Nachrichten', to: '/newspaper/all' },
          { label: article.title || 'Artikel' },
        ]"
        class="mb-4"
      />

      <UCard>
        <div class="space-y-4">
          <div
            class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
          >
            <span class="font-semibold">{{
              article.newspaper?.name || "Unbekannte Quelle"
            }}</span>
            <span v-if="formattedDate">|</span>
            <span>{{ formattedDate }}</span>
          </div>

          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {{ article.title }}
          </h1>

          <UAlert
            icon="i-heroicons-chat-bubble-left-right"
            :description="article.snippet || 'Keine Beschreibung verfügbar.'"
            class="prose dark:prose-invert max-w-none"
          />

          <div class="pt-4">
            <UButton
              :to="article.link"
              target="_blank"
              icon="i-heroicons-arrow-top-right-on-square"
              size="xl"
              label="Ganzen Artikel lesen"
              trailing
            />
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>