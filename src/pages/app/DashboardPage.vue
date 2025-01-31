<script setup lang="ts">
import DashboardGraphs from "@/components/dashboard/DashboardGraphs.vue";

import CardsDashboard from "../../components/dashboard/CardsDashboard.vue";
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold tracking-tighter">
      {{ $t("sidebar.dashboard") }}
    </h1>
  </div>
  <div class="p-6 space-y-6">
    <CardsDashboard />
    <DashboardGraphs />
  </div>
</template>
