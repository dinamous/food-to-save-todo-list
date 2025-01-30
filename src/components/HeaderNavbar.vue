<template lang="html">
  <div class="border-b">
    <div class="flex h-16 items-center gap-6 px-6">
      <Icon icon="mdi:todo-auto" class="text-xl" />
      <Separator orientation="vertical" class="h-6" />
      <nav class="flex items-center space-x-4 lg:space-x-6 ">
        <NavLink link="/" page="Dashboard" icon="lucide:home" label="Dashboard" />
        <NavLink link="/tasks" page="Tasks" icon="lucide:clipboard-list" label="Tarefas" />
        <NavLink link="/users" page="Users" icon="lucide:users" label="Usuários" />
      </nav>

      <!-- <div class="ml-auto flex items-center gap-2">
        <AccountMenu />
      </div> -->
    </div>
  </div>
</template>


<script setup>
import { Icon } from "@iconify/vue";

import NavLink from "@/components/NavLink.vue"
import { Separator } from "@/components/ui/separator"

// import AccountMenu from "./AccountMenu.vue";
</script>


<style lang="">

</style>