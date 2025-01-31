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
import { ArrowUpDown, Pencil, Plus, Trash2 } from "lucide-vue-next";
import { computed, h, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task, TaskPriority, TaskStatus, useTasksStore } from "@/stores/tasks";
import { useUsersStore } from "@/stores/users";

import TaskForm from "./TaskFormModal.vue";

const tasksStore = useTasksStore();
const usersStore = useUsersStore();

tasksStore.initTasks();
usersStore.initUsers();

const sorting = ref<SortingState>([]);
const selectedTask = ref<Task | undefined>(undefined);
const isEditModalOpen = ref(false);
const isAddModalOpen = ref(false);

const statusFilter = ref<TaskStatus | "all">("all");
const priorityFilter = ref<TaskPriority | "all">("all");

watchEffect(() => {
  tasksStore.setFilters({
    status: statusFilter.value !== "all" ? statusFilter.value : undefined,
    priority: priorityFilter.value !== "all" ? priorityFilter.value : undefined,
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
        () => ["Título", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      ),
  }),
  columnHelper.accessor("description", {
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      const truncatedDescription = description.length > 30 ? description.slice(0, 30) + "..." : description;
      return h("div", { class: "truncate w-[200px]" }, truncatedDescription); // Adicionando classe CSS para truncar
    },
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
        () => ["Criado em", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formattedDate = createdAt.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(",", " -");
      return formattedDate;
    },
  }),
  columnHelper.accessor("assigneeId", {
    header: "Responsável",
    cell: ({ row }) => {
      const user = usersStore.users.find(
        (u) => u.id === row.getValue("assigneeId")
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
          () => h(Pencil, { class: "h-4 w-4" })
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
          () => h(Trash2, { class: "h-4 w-4 text-red-500" })
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
    sorting.value = newSorting;

    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      if (["title", "createdAt", "dueDate"].includes(id)) {
        tasksStore.setSorting(
          id as "title" | "createdAt" | "dueDate",
          desc ? "desc" : "asc"
        );
      }
    }

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

const hasUsers = computed(() => usersStore.users.length > 0);

const dueDateDefault = computed(() => {
  const today = new Date();
  today.setDate(today.getDate() + 7);
  return today;
});

const router = useRouter();

const goToUsersPage = () => {
  router.push("/users");
};
</script>

<template>
  <div class="w-full">
    <div class="flex items-end justify-between gap-4 py-4 mb-4">
      <div class="flex gap-2">
        <Button @click="isAddModalOpen = true" :disabled="!hasUsers">
          Nova Tarefa
        </Button>

        <Button variant="secondary" @click="goToUsersPage" v-if="!hasUsers">
          <Plus /> Adicionar Usuário
        </Button>
      </div>


      <div class="flex max-w-2xl flex-1 items-center gap-4">
        <div class="grid flex-1 gap-2">
          <!-- Label para o filtro de status -->
          <label for="statusFilter" class="text-sm font-medium text-gray-400">Filtrar por Status</label>
          <Select id="statusFilter" v-model="statusFilter">
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Status" />
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
              <SelectItem value="all">
                Todos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="grid flex-1 gap-2">
          <!-- Label para o filtro de prioridade -->
          <label for="priorityFilter" class="text-sm font-medium text-gray-400">Filtrar por Prioridade</label>
          <Select id="priorityFilter" v-model="priorityFilter">
            <SelectTrigger>
              <SelectValue placeholder="Selecione a Prioridade" />
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
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id" :class="{
            'w-[200px]': header.id === 'title',
            'w-[150px]': header.id === 'status'
          }">
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
          class="hover:bg-muted/20 transition-colors cursor-pointer" @click="handleRowClick(row.original)">
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
        <TableRow v-if="table.getRowModel().rows.length === 0">
          <TableCell :colspan="columns.length" class="h-24 text-center">
            Nenhuma tarefa encontrada
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Página {{ tasksStore.currentPage }} de {{ tasksStore.totalPages }}
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="tasksStore.currentPage === 1"
          @click="tasksStore.setPage(tasksStore.currentPage - 1)">
          Anterior
        </Button>
        <Button variant="outline" size="sm" :disabled="tasksStore.currentPage >= tasksStore.totalPages"
          @click="tasksStore.setPage(tasksStore.currentPage + 1)">
          Próxima
        </Button>
      </div>
    </div>

    <TaskForm :model-value="isAddModalOpen" :task="selectedTask" @update:model-value="isAddModalOpen = $event"
      @saved="handleTaskSaved" />
  </div>
</template>
<style scoped></style>