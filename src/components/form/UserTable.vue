<script setup lang="ts">
import { createColumnHelper, getCoreRowModel, useVueTable } from "@tanstack/vue-table"
import { h } from "vue"

import { User, useUsersStore } from "@/stores/users"

import UserFormModal from "./UserFormModal.vue"

// Store
const usersStore = useUsersStore()
usersStore.initUsers()

// Configuração da Tabela
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor("name", {
    header: "Nome",
    cell: ({ row }) => h("div", row.getValue("name")),
  }),
  columnHelper.accessor("email", {
    header: "E-mail",
    cell: ({ row }) => h("div", row.getValue("email")),
  }),
]

const table = useVueTable({
  data: usersStore.users,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between py-4">
      <UserFormModal />
    </div>

    <div class="rounded-md border">
      <table class="w-full">
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id" class="border-b p-4 text-left">
              {{ header.column.columnDef.header }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-muted/50">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-4">
              {{ cell.getValue() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>