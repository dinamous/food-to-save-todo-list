<script>
import { Button } from "@/components/ui/button";
</script>


<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold tracking-tighter">
      {{ $t("sidebar.dashboard") }}
    </h1>

   <Button class="mt-4" variant="outline" prepend-icon="ArrowLeft">
            Voltar ao início
          </Button>
  </div>
</template>
