<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-vue-next";
import { computed, h, ref, watchEffect } from "vue";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task, TaskPriority, TaskStatus, useTasksStore } from "@/stores/tasks";
import { useUsersStore } from "@/stores/users";

import TaskForm from "./TaskFormModal.vue"; // Importe o TaskForm

const tasksStore = useTasksStore();
tasksStore.initTasks();

const usersStore = useUsersStore();
usersStore.initUsers();

const sorting = ref<SortingState>([]);
const selectedTask = ref<Task | undefined>(undefined);
const isEditModalOpen = ref(false);
const isAddModalOpen = ref(false);

// Filtros
const statusFilter = ref<TaskStatus | "">("");
const priorityFilter = ref<TaskPriority | "">("");

watchEffect(() => {
  tasksStore.setFilters({
    status: statusFilter.value || undefined,
    priority: priorityFilter.value || undefined,
  });
});

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor("title", {
    header: ({ column }) =>
      h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Título", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      ),
  }),
  columnHelper.accessor("description", {
    header: "Descrição",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("priority", {
    header: "Prioridade",
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) =>
      h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Criado em", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      ),
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  }),
  columnHelper.accessor("assigneeId", {
    header: "Responsável",
    cell: ({ row }) => {
      const user = usersStore.users.find(
        (u) => u.id === row.getValue("assigneeId"),
      );
      return user?.name || "Não atribuído";
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) =>
      h("div", { class: "flex gap-2" }, [
        h(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: (e: MouseEvent) => {
              e.stopPropagation();
              selectedTask.value = row.original;
              isEditModalOpen.value = true;
            },
          },
          () => h(Pencil, { class: "h-4 w-4" }),
        ),
        h(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: (e: MouseEvent) => {
              e.stopPropagation();
              tasksStore.deleteTask(row.original.id);
            },
          },
          () => h(Trash2, { class: "h-4 w-4 text-red-500" }),
        ),
      ]),
  }),
];

const table = useVueTable({
  data: computed(() => tasksStore.paginatedTasks),
  columns,
  state: {
    get sorting() {
      return sorting.value;
    },
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onSortingChange: (updater) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting.value) : updater;
    sorting.value = [...newSorting];
    tasksStore.setPage(1);
  },
});

const handleRowClick = (task: Task) => {
  selectedTask.value = task;
  isEditModalOpen.value = true;
};

const handleTaskSaved = () => {
  isAddModalOpen.value = false;
};
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between gap-4 py-4">
      <Button @click="isAddModalOpen = true">
        Nova Tarefa
      </Button>

      <div class="flex max-w-2xl flex-1 items-center gap-4">
        <div class="grid flex-1 gap-2">
          <Select v-model="statusFilter">
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">
                Pendente
              </SelectItem>
              <SelectItem value="Em progresso">
                Em progresso
              </SelectItem>
              <SelectItem value="Concluída">
                Concluída
              </SelectItem>
              <!-- Add a placeholder with a valid value -->
              <SelectItem value="all">
                Todos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="grid flex-1 gap-2">
          <Select v-model="priorityFilter">
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Baixa">
                Baixa
              </SelectItem>
              <SelectItem value="Média">
                Média
              </SelectItem>
              <SelectItem value="Alta">
                Alta
              </SelectItem>
              <!-- Add a placeholder with a valid value -->
              <SelectItem value="all">
                Todas
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="column in table.getHeaderGroups()[0].headers" :key="column.id">
            <FlexRender :render="column.column.columnDef.header" :props="column.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id" @click="handleRowClick(row.original)">
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Modal de edição/adicionar -->
    <TaskForm :model-value="isAddModalOpen" @update:model-value="isAddModalOpen = $event" @saved="handleTaskSaved" />
  </div>
</template>
