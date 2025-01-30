<template>
  <Toaster rich-colors />
  <routerView />
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { onMounted } from "vue";
import { Toaster } from "vue-sonner"

import { useThemeStore } from "./stores/theme";


useHead({
  titleTemplate: "%s | Task to Save",
  meta: [
    {
      name: "description",
      content: "food to save TODO list"
    }
  ]
});

onMounted(() => {
  useThemeStore().initTheme();
});


</script>

<style scoped></style>
