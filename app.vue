<script setup lang="ts">
import { ref } from "vue";

const isSidebarOpen = ref(false);
const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <UApp>
    <div class="flex h-screen w-screen bg-slate-900">
      <!-- Overlay for mobile -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="closeSidebar"
      ></div>

      <!-- Sidebar -->
      <div
        :class="[
          'fixed inset-y-0 left-0 z-30 w-[300px] transform bg-slate-900 transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:flex-shrink-0', // Desktop: Revert to original state
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full', // Mobile: Slide in/out
        ]"
      >
        <AppNav :close-sidebar="closeSidebar" />
      </div>

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-y-auto">
        <!-- Mobile-only Header -->
        <div
          class="sticky top-0 z-10 flex items-center gap-4 bg-slate-900/80 p-4 backdrop-blur-sm lg:hidden"
        >
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            @click="isSidebarOpen = true"
          />
          <p class="text-lg font-bold">
            <span class="text-primary">mn</span><span>apps</span>
          </p>
        </div>

        <!-- Page Content -->
        <!-- On desktop, this mirrors your original content div -->
        <div
          class="flex-1 p-4 lg:mt-4 lg:rounded-tl-xl lg:border-l-2 lg:border-t-2 lg:border-white/10 lg:bg-gray-950 lg:p-8"
        >
          <NuxtPage />
        </div>
      </div>
    </div>
  </UApp>
</template>