<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useVueTable
} from "@tanstack/vue-table"
import { ArrowUpDown, Trash2 } from "lucide-vue-next"
import { computed, h, ref, watchEffect } from "vue"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User, useUsersStore } from "@/stores/users"

import UserFormModal from "./UserFormModal.vue"

const usersStore = useUsersStore()
usersStore.initUsers()

const sorting = ref<SortingState>([])
const selectedUser = ref<User | null>(null)
const isEditModalOpen = ref(false)
const isAddModalOpen = ref(false)

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor("name", {
    header: ({ column }) => h(Button, {
      variant: "ghost",
      onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
    }, () => ["Nome", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]),
    cell: ({ row }) => h("div", row.getValue("name")),
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => h(Button, {
      variant: "ghost",
      onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
    }, () => ["E-mail", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]),
    cell: ({ row }) => h("div", row.getValue("email")),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => h(Button, {
      size: "sm",
      variant: "ghost",
      onClick: (e) => {
        e.stopPropagation()
        usersStore.deleteUser(row.original.id)
      },
    }, () => h(Trash2, { class: "h-4 w-4 text-red-500" })),
  }),
]

const table = useVueTable({
  data: computed(() => usersStore.paginatedUsers),
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
    set sorting(value) {
      sorting.value = [...value] // Criando uma cópia para garantir reatividade
    }
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onSortingChange: updater => {
    const newSorting = typeof updater === "function" ? updater(sorting.value) : updater
    sorting.value = [...newSorting]
    usersStore.setPage(1) // Resetar para a primeira página ao ordenar
  },
})

// Abrir modal ao clicar na linha
const handleRowClick = (user: User) => {
  selectedUser.value = user
  isEditModalOpen.value = true
}

watchEffect(() => {
  if (!isEditModalOpen.value) {
    selectedUser.value = null
  }
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between py-4">
      <Button @click="isAddModalOpen = true">
        Adicionar Usuário
      </Button>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Input v-model="usersStore.pageSize" type="number" min="1" class="w-20"
            @update:model-value="usersStore.setPageSize(Number($event))" />
          <span class="text-sm text-muted-foreground">Itens por página</span>
        </div>
      </div>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id" class="cursor-pointer hover:bg-muted/50"
            @click="handleRowClick(row.original)">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>

          <TableRow v-if="table.getRowModel().rows.length === 0">
            <TableCell :colspan="columns.length" class="h-24 text-center">
              Nenhum usuário encontrado.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Paginação -->
    <div class="flex items-center justify-between py-4">
      <div class="text-sm text-muted-foreground">
        Mostrando {{ usersStore.paginatedUsers.length }} de {{ usersStore.users.length }} resultados
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="usersStore.currentPage === 1"
          @click="usersStore.setPage(usersStore.currentPage - 1)">
          Anterior
        </Button>
        <span class="px-4 text-sm">
          Página {{ usersStore.currentPage }} de {{ usersStore.totalPages }}
        </span>
        <Button variant="outline" size="sm" :disabled="usersStore.currentPage >= usersStore.totalPages"
          @click="usersStore.setPage(usersStore.currentPage + 1)">
          Próxima
        </Button>
      </div>
    </div>

    <!-- Modais -->
    <UserFormModal v-model:model-value="isAddModalOpen" @saved="isAddModalOpen = false" />

    <UserFormModal v-model:model-value="isEditModalOpen" :user="selectedUser" @saved="isEditModalOpen = false" />
  </div>
</template>
