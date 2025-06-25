<script setup lang="ts">
const user = useSupabaseUser();
const route = useRoute();

// Accept a function prop to close the sidebar on mobile
const props = defineProps<{
  closeSidebar?: () => void;
}>();

const navigation = [
  { name: "Startseite", href: "/", icon: "i-lucide-home" },
  { name: "Länder", href: "/countries", icon: "i-lucide-globe" },
  /*{ name: "Währungen", href: "/currencies", icon: "i-lucide-coins" },*/
  { name: "Zeitungen", href: "/newspapers", icon: "i-lucide-newspaper" },
  { name: "RSS-Listen", href: "/rss-feeds", icon: "i-lucide-rss" },
];

const isActive = (href: string) => {
  if (href === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(href);
};
</script>

<template>
  <div class="flex h-full flex-col justify-between">
    <div class="m-4">
      <div class="hidden lg:block">
        <p class="font-bold text-2xl">
          <span class="text-primary">mn</span><span>apps</span>
        </p>
        <p class="text-sm text-white/50">v1.0.0 Beta</p>
      </div>
      <div class="mt-4 font-medium text-md">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            'flex items-center gap-2 rounded-lg p-2 mb-2 hover:bg-white/10',
            isActive(item.href)
              ? 'bg-gray-950 border border-white/20'
              : '',
          ]"
          @click="props.closeSidebar?.()"
        >
          <UIcon :name="item.icon" />
          <p>{{ item.name }}</p>
        </NuxtLink>
        <div class="lg:hidden">
      <UButton
        v-if="user?.id"
        variant="outline"
        to="/auth/logout"
        trailing-icon="i-lucide-arrow-right"
        class="w-full justify-center"
        >Abmelden</UButton
      >
      <UButton
        v-else
        to="/auth/login"
        trailing-icon="i-lucide-arrow-right"
        class="w-full justify-center"
        >Anmelden
      </UButton>
        </div>
      </div>
    </div>
    <div class="m-4">
      <UButton
        v-if="user?.id"
        variant="outline"
        to="/auth/logout"
        trailing-icon="i-lucide-arrow-right"
        class="w-full justify-center"
        >Abmelden</UButton
      >
      <UButton
        v-else
        to="/auth/login"
        trailing-icon="i-lucide-arrow-right"
        class="w-full justify-center"
        >Anmelden
      </UButton>
    </div>
  </div>
</template>