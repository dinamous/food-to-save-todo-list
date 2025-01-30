<template>
  <HeaderNavbar>
    <div class="p-6">
      <router-view /> <!-- Conteúdo das páginas filhas -->
    </div>
  </HeaderNavbar>
</template>

<script setup>
import HeaderNavbar from "@/components/HeaderNavbar.vue"
</script>

<style>
/* Garante altura correta considerando o header */
main {
  min-height: calc(100vh - 4rem);
}

/* Transição suave para mobile */
.aside-transition {
  transition: transform 0.3s ease-in-out;
}
</style>