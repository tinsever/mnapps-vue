<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps({
  listId: {
    type: String,
    required: true,
  },
});

const {
  newsListEditSchema,
  getNewsList,
  populateFormState,
  createFormState,
  selectableAuthors,
  pendingAuthors,
  selectableCategories,
  pendingCategories,
  editAuthorFilter,
  editCategoryFilter,
} = useNewsList();

const schema = newsListEditSchema;
type Schema = typeof newsListEditSchema._output;

const state = createFormState();
const formRef = ref();
const loading = ref(false);

const { data: newsList, pending: pendingList } = await useAsyncData(
  `news-list-${props.listId}`,
  () => getNewsList(props.listId), 
);

watch(
  newsList,
  (listData) => {
    if (listData) {
      populateFormState(state, listData);
    }
  },
  { immediate: true },
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const [authorResult, categoryResult] = await Promise.all([
      editAuthorFilter(props.listId, event.data.filter_authors ?? []),
      editCategoryFilter(props.listId, event.data.filter_categories ?? []),
    ]);

    if (!authorResult || !categoryResult) {
      console.error("One or more filters failed to save.");
    }
  } catch (error) {
    console.error("An error occurred during saving:", error);
  } finally {
    loading.value = false;
  }
}

function handleSave() {
  formRef.value?.submit();
}
</script>

<template>
  <div v-if="pendingList">
    <USkeleton class="h-12 w-full mb-4" />
    <USkeleton class="h-12 w-full" />
  </div>

  <div v-else>
    <UForm ref="formRef" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="filter_authors" label="Nach Autoren filtern">
        <USelectMenu v-model="state.filter_authors" :items="selectableAuthors ?? []" :loading="pendingAuthors" multiple
          placeholder="Autoren auswählen" searchable class="!w-full" size="lg" />
      </UFormField>

      <UFormField name="filter_categories" label="Nach Kategorien filtern">
        <USelectMenu v-model="state.filter_categories" :items="selectableCategories ?? []" :loading="pendingCategories"
          multiple placeholder="Kategorien auswählen" searchable size="lg" class="!w-full" />
      </UFormField>

      <div class="flex justify-end mt-6">
        <UButton @click="handleSave" :loading="loading" :disabled="loading" icon="i-heroicons-check-circle">
          Filter speichern
        </UButton>
      </div>
    </UForm>
  </div>
</template>