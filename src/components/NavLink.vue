<template>
  <div>
    <router-link :to="link" :data-current="currentRouteName === page ? 'true' : 'false'"
      class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground">
      <Icon :icon="icon" class="text-lg" />
      {{ label }}
    </router-link>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router"

export default {
  setup() {
    const router = useRouter()
    const currentRouteName = computed(() => router.currentRoute.value.name)
    return { currentRouteName }
  },
  components: {
    RouterLink,
    Icon
  },
  props: {
    link: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  }
};
</script>

<style>
/* Estilos opcionais */
</style>
