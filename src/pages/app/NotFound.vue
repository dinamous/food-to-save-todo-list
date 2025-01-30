<script setup lang="ts">
import { RouterLink } from "vue-router";

import { Button } from "@/components/ui/button";
</script>

<template>
  <section class="bg-white dark:bg-gray-900 h-screen w-screen flex">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex items-center justify-center">
      <div class="mx-auto max-w-screen-sm text-center">
        <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
          404
        </h1>
        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          Algo deu errado.
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Desculpe, não encontramos a página desejada. Você encontrará muita mais coisas a explorar.
        </p>
        <RouterLink to="/">
          <Button class="mt-4" variant="outline" prepend-icon="ArrowLeft">
            Voltar ao início
          </Button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>