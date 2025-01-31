<script setup lang="ts">
import TaskTable from "@/components/tasks/TaskTable.vue";
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <h1 class="text-3xl font-bold tracking-tighter">
      {{ $t("sidebar.tasks") }}
    </h1>

    <div class="flex-1">
      <TaskTable />
    </div>
  </div>
</template>