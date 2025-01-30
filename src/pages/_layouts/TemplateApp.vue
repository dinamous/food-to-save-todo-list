<template lang="html">
  <div class="flex flex-col antialiased">
    <Header />
  </div>
  <div class="flex flex-1 flex-col gap-4 p-8 pt-6">
    <router-view />
  </div>
</template>


<script setup>
import Header from "@/components/HeaderNavbar.vue";
</script>
<style lang="">

</style>