<template lang="html">
  <!-- Cabeçalho -->
  <div class="flex flex-col px-2 py-1.5">
    <span class="text-sm font-medium">Dinamous</span>
    <span class="text-xs font-normal text-muted-foreground">dinamous@dev.com</span>
  </div>

  <!-- Separador -->
  <div class="h-px bg-border" />

  <!-- Itens do menu -->
  <div class="space-y-1">
    <router-link to="/account">
      <div class="flex gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
        <Icon icon="lucide:circle-user-round" class="h-4 w-4" />
        <span>Meu perfil</span>
      </div>
    </router-link>

    <router-link to="/sign-in" class="block">
      <div
        class="flex gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-sm text-rose-500 hover:bg-accent dark:text-rose-400">
        <Icon icon="lucide:log-out" class="h-4 w-4" />
        <span>Sair</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router"
</script>