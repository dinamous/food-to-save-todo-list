<template>
  <div>
    <!-- Botão Mobile (Hamburguer) -->
    <Button v-if="!isOpen" @click="isOpen = true" variant="ghost" size="icon" class="md:hidden fixed top-4 left-4 z-50"
      aria-label="Fechar menu">
      <Icon icon="lucide:menu" class="h-5 w-5" />
    </Button>

    <!-- Overlay Mobile -->
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/50 md:hidden" @click="isOpen = false" />

    <!-- Sidebar -->
    <aside :class="[
      'fixed md:relative z-40 h-screen w-48 border-r bg-background transform transition-all duration-300',
      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 md:opacity-100 opacity-0'
    ]">
      <div class="flex flex-col h-full py-6 gap-6 px-4">
        <!-- Cabeçalho com Botão Fechar Mobile -->
        <div class="flex items-center gap-3 px-2">
          <Icon icon="mdi:todo-auto" class="text-xl shrink-0" />
          <span class="font-semibold truncate">Task to Save</span>

          <!-- Botão Fechar (Mobile) -->
          <Button @click="isOpen = false" variant="ghost" size="icon" class="md:hidden ml-auto shrink-0">
            <Icon icon="lucide:x" class="h-5 w-5" />
          </Button>
        </div>

        <Separator orientation="horizontal" class="w-full" />

        <nav class="flex flex-1 flex-col gap-4">
          <NavLink link="/" page="Dashboard" icon="lucide:home" label="Dashboard" />
          <NavLink link="/tasks" page="Tasks" icon="lucide:clipboard-list" label="Tarefas" />
          <NavLink link="/users" page="Users" icon="lucide:users" label="Usuários" />
        </nav>

        <div class="mt-auto">
          <Separator orientation="horizontal" class="w-full mb-4" />
          <AccountMenu />
        </div>
      </div>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="md:ml-48 p-4 transition-margin duration-300">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue"
import { onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

import NavLink from "@/components/NavLink.vue"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import AccountMenu from "./AccountMenu.vue"

const isOpen = ref(false)

// Controle de redimensionamento
const handleResize = () => {
  if (window.innerWidth >= 768) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener("resize", handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
})


const route = useRoute()

watch(() => route.path, () => {
  if (window.innerWidth < 768) {
    isOpen.value = false
  }
})
</script>