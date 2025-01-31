<script setup lang="ts">
import UserTable from "@/components/form/UserTable.vue";

</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <h1 class="text-3xl font-bold tracking-tighter">
      {{ $t("sidebar.users") }}
    </h1>

    <div class="flex-1">
      <UserTable />
    </div>
  </div>
</template>