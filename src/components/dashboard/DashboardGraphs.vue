<template lang="html">
  <Card class="col-span-4">
    <CardHeader class="flex-row items-center justify-between pb-8">
      <div class="space-y-1">
        <CardTitle class="text-base font-medium">
          Distribuição de Tarefas
        </CardTitle>
        <CardDescription>Relação das tarefas com cada usuário.</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <VisXYContainer :data="data" :padding="margin">
        <VisAxis type="y" />

        <VisTooltip :triggers="triggers" />
        <VisStackedBar :x="a" :y="b" :rounded-corners="5" color="#809ddd" :bar-width="50" />

        <VisAxis type="x" :tick-format="tickFormat" :domain-line="false" :tick-text-angle="15" tick-text-align="left"
          tick-text-fit-mode="wrap" />
      </VisXYContainer>
    </CardContent>
  </Card>
</template>


<script lang="ts" setup>
import { StackedBar } from "@unovis/ts"
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from "@unovis/vue"
import { onMounted, ref } from "vue"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasksStore } from "@/stores/tasks";
import { useUsersStore } from "@/stores/users";

const tasksStore = useTasksStore();
const usersStore = useUsersStore();

type DataRecord = { x: number; amount: number }

onMounted(() => {
  tasksStore.initTasks()
  usersStore.initUsers()
})

const userTaskCount = ref(
  usersStore.users.map((user) => {
    const userTasksCount = tasksStore.tasks.filter(
      (task) => task.assigneeId === user.id
    ).length;

    return {
      name: user.name,
      amount: userTasksCount,
    };
  })
);

const data = ref(
  userTaskCount.value.map((userData, index) => ({
    x: index,
    amount: userData.amount,
  }))
);

const margin = { left: 30, right: 30 }

const a = (d: DataRecord) => d.x
const b = (d: DataRecord) => d.amount

const triggers = {
  [StackedBar.selectors.bar]: (d: DataRecord) => `Qtd: ${d.amount}`,
}

const users = ref(usersStore.users.map((user) => user.name));
const tickFormat = (tick: number) => users.value[tick]
</script>
<style lang="">

</style>