<script setup lang="ts">
import { computed, ref, watch } from "vue"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { User, useUsersStore } from "@/stores/users"

const props = defineProps<{
  user?: User
  modelValue: boolean
}>()

const emit = defineEmits(["update:modelValue", "saved"])

const usersStore = useUsersStore()
const form = ref({
  id: "",
  name: "",
  email: ""
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
})

watch(() => props.user, (user) => {
  if (user) {
    form.value = { ...user }
  } else {
    form.value = { id: "", name: "", email: "" }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!form.value.name || !form.value.email) return

  if (props.user) {
    usersStore.updateUser(form.value)
  } else {
    usersStore.addUser(form.value)
  }

  emit("saved")
}
</script>

<template>
  <Dialog v-model:open="isOpen" id="#dialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ user ? 'Editar Usuário' : 'Novo Usuário' }}
        </DialogTitle>
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
          {{ user ? 'Salvar Alterações' : 'Cadastrar' }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>