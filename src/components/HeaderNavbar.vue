<template lang="html">
  <!-- Container principal da sidebar -->
  <div class="h-screen w-48 border-r fixed left-0 top-0 bg-background">
    <div class="flex flex-col h-full py-6 gap-6 px-4">
      <!-- Cabeçalho com ícone -->
      <div class="flex items-center gap-3 px-2">
        <Icon icon="mdi:todo-auto" class="text-xl" />
        <span class="font-semibold">Task to Save</span>
      </div>

      <Separator orientation="horizontal" class="w-full" />

      <!-- Navegação vertical -->
      <nav class="flex flex-1 flex-col gap-4">
        <NavLink link="/" page="Dashboard" icon="lucide:home" label="Dashboard" />
        <NavLink link="/tasks" page="Tasks" icon="lucide:clipboard-list" label="Tarefas" />
        <NavLink link="/users" page="Users" icon="lucide:users" label="Usuários" />
      </nav>

      <!-- Seção inferior (opcional) -->
      <div class="mt-auto">
        <Separator orientation="horizontal" class="w-full mb-4" />
        <!-- <AccountMenu /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

import NavLink from "@/components/NavLink.vue";
import { Separator } from "@/components/ui/separator";
</script>