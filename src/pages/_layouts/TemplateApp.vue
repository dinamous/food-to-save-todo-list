<template>
  <HeaderNavbar>
    <div class="p-6">
      <router-view /> 
    </div>
  </HeaderNavbar>
</template>

<script setup>
import HeaderNavbar from "@/components/Sidebar/HeaderNavbar.vue"
</script>

<style>

main {
  min-height: calc(100vh - 4rem);
}

.aside-transition {
  transition: transform 0.3s ease-in-out;
}
</style>