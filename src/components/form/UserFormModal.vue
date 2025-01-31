<script setup lang="ts">
import { ref } from "vue"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useUsersStore } from "@/stores/users"

const isOpen = ref(false)
const usersStore = useUsersStore()
const form = ref({
  name: "",
  email: ""
})

const handleSubmit = () => {
  if (form.value.name && form.value.email) {
    usersStore.addUser({
      name: form.value.name,
      email: form.value.email
    })
    isOpen.value = false
    form.value = { name: "", email: "" }
  }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="default">
        Adicionar Usuário
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <label for="name">Nome</label>
          <Input id="name" v-model="form.name" placeholder="Nome completo" />
        </div>

        <div class="grid gap-2">
          <label for="email">E-mail</label>
          <Input id="email" v-model="form.email" type="email" placeholder="exemplo@email.com" />
        </div>

        <Button @click="handleSubmit">
          Salvar
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>