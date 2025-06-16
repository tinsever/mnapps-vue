<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

const {
  newsListCreateSchema,
  createNewsList,
  createFormState,
  navigateToNewsListEdit,
  selectableNewspapers, 
  pendingNewspapers, 
} = useNewsList();

const schema = newsListCreateSchema;
type Schema = typeof newsListCreateSchema._output;

const state = createFormState();
const formRef = ref();
const loading = ref(false);

const formattedSelectableNewspapers = computed(() => {
  return (selectableNewspapers.value ?? []).map((item) => ({
    ...item,
    label: item.label ?? "", 
  }));
});

const selectedNewspapers = computed({
  get() {
    const allItems = formattedSelectableNewspapers.value;
    if (!state.newspapers || !allItems) {
      return [];
    }
    const selectedIds = new Set(state.newspapers);
    return allItems.filter((item) => selectedIds.has(item.value));
  },
  set(newValue: { label: string; value: number }[]) {
    state.newspapers = newValue.map((item) => item.value);
  },
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const result = await createNewsList(event.data);
    if (result.success && result.listId) {
      navigateToNewsListEdit(result.listId);
    }
  } finally {
    loading.value = false;
  }
}

function handleSave() {
  formRef.value?.submit();
}
</script>

<template>
  <UModal
    title="Neue RSS-Liste erstellen"
    :ui="{
      title: 'text-xl font-bold',
    }"
  >
    <slot></slot>
    <template #body>
      <div class="w-full max-w-3xl">
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 gap-6">
          <UFormField name="name" label="Listenname">
            <UInput
              v-model="state.name"
              placeholder="z.B. Meine Tech-News"
              size="lg"
              icon="i-heroicons-tag"
              class="w-full"
            />
          </UFormField>

          <UFormField name="newspapers" label="Zeitungen auswählen">
            <USelectMenu
              v-model="selectedNewspapers"
              :items="formattedSelectableNewspapers"
              :loading="pendingNewspapers"
              multiple
              placeholder="Zeitungen zur Liste hinzufügen"
              by="value"
              option-attribute="label"
              searchable
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>
      </UForm>

        <div class="mt-8 flex justify-end">
          <UButton
            @click="handleSave"
            :loading="loading"
            size="lg"
            icon="i-heroicons-check"
            :disabled="loading"
          >
            {{ loading ? "Wird erstellt..." : "Zeitung erstellen" }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>