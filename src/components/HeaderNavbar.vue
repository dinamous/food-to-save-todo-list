<template>
  <div>
    <header class="h-16 border-b bg-background fixed top-0 left-0 right-0 z-50">
      <div class="flex items-center h-full px-4">
        <Button v-if="!isOpen" @click="isOpen = true" variant="ghost" size="icon" class="md:hidden">
          <Icon icon="lucide:menu" class="h-5 w-5" />
        </Button>


        <div class="flex flex-1 justify-between items-center">
          <span class="font-semibold ml-2">Task to Save</span>
          <Button variant="outline" class="border-0 p-[6px] ml-2 w-8 h-8" @click="toggleMode">
            <Sun v-if="store.isDark" />
            <MoonStar v-else />
          </Button>
        </div>
      </div>
    </header>


    <aside :class="[
      'fixed md:block z-40 h-screen w-48 border-r bg-background transform transition-transform duration-300 mt-16',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]">
      <div class="flex flex-col h-[calc(100vh-4rem)] py-6 gap-6 px-4">
        <nav class="flex flex-1 flex-col gap-4">
          <NavLink link="/" page="Dashboard" icon="lucide:home" label="Dashboard" />
          <NavLink link="/tasks" page="Tasks" icon="lucide:clipboard-list" label="Tarefas" />
          <NavLink link="/users" page="Users" icon="lucide:users" label="Usuários" />
        </nav>

        <div class="mt-auto">
          <Separator class="mb-4" />
          <AccountMenu />
        </div>
      </div>
    </aside>


    <div v-if="isOpen" class="fixed inset-0 z-30 bg-black/50 md:hidden" @click="isOpen = false" />


    <main :class="[
      'pt-16 md:ml-48 transition-all duration-300 min-h-screen',
      isOpen ? 'ml-48' : 'ml-0'
    ]">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue"
import {
  Bell,
  MoonStar,
  Sun,
} from "lucide-vue-next"
import { onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute } from "vue-router"

import NavLink from "@/components/NavLink.vue"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useThemeStore } from "@/stores/theme"

import AccountMenu from "./AccountMenu.vue"

const isOpen = ref(false)
const route = useRoute()

const store = useThemeStore();

const handleResize = () => {
  isOpen.value = window.innerWidth >= 768
}

onMounted(() => {
  handleResize()
  window.addEventListener("resize", handleResize)
})

onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
})

watch(() => route.path, () => {
  if (window.innerWidth < 768) {
    isOpen.value = false
  }
})

const toggleMode = () => {
  store.toggleTheme();
};
</script>