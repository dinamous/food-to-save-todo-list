<script setup lang="ts">
import { computed, onMounted } from "vue";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasksStore } from "@/stores/tasks"
import { useUsersStore } from "@/stores/users"

const tasksStore = useTasksStore()
const usersStore = useUsersStore()

const taskStatusData = computed(() => {
  const counts = { Pendente: 0, "Em progresso": 0, Concluída: 0 };

  tasksStore.tasks.forEach((t) => {
    if (t.status !== "all") {
      counts[t.status]++;
    }
  });

  return Object.entries(counts).map(([status, count]) => ({ status, count }));
});

onMounted(() => {
  tasksStore.initTasks()
  usersStore.initUsers()
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Total Tarefas</CardTitle>
        <CardDescription>Total de tarefas cadastradas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ tasksStore.tasks.length }}
        </div>
      </CardContent>
    </Card>


    <Card class="w-full">
      <CardHeader>
        <CardTitle>Tarefas Pendentes</CardTitle>
        <CardDescription>Tarefas ainda não concluídas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-amber-500">
          {{ taskStatusData.find(d => d.status === 'Pendente')?.count || 0 }}
        </div>
      </CardContent>
    </Card>


    <Card class="w-full">
      <CardHeader>
        <CardTitle>Tarefas Concluídas</CardTitle>
        <CardDescription>Tarefas finalizadas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold text-green-500">
          {{ taskStatusData.find(d => d.status === 'Concluída')?.count || 0 }}
        </div>
      </CardContent>
    </Card>


    <Card class="w-full">
      <CardHeader>
        <CardTitle>Usuários Cadastrados</CardTitle>
        <CardDescription>Usuários que fazem parte do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ usersStore.users.length }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>