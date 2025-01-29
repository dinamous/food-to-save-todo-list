<template>
  <!-- <ThemeProvider :default-theme="defaultTheme" storage-key="myAppTheme"> -->
  <Toaster rich-colors />
  <routerView />
  <!-- </ThemeProvider> -->
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
// import { inject } from 'vue';
import { Toaster } from 'vue-sonner'

// const ThemeProviderContext = Symbol('ThemeProviderContext');

// export const useTheme = () => {
//   const context = inject(ThemeProviderContext);

//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }

//   return context;
// };

// import ThemeProvider from '@/components/ThemeProvider.vue';
// const defaultTheme = 'dark';

useHead({
  titleTemplate: '%s | pizza.shop',
  meta: [
    {
      name: 'description',
      content: 'a pizza shop'
    }
  ]
});


</script>

<style scoped></style>
