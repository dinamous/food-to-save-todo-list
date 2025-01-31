<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task, useTasksStore } from "@/stores/tasks";
import { useThemeStore } from "@/stores/theme";
import { useUsersStore } from "@/stores/users";

const props = defineProps<{
  task?: Task;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "saved"]);

const tasksStore = useTasksStore();
const usersStore = useUsersStore();
const themeStore = useThemeStore();
usersStore.initUsers();

const form = ref({
  id: "",
  title: "TASK-",
  description: "",
  status: "Pendente" as Task["status"],
  priority: "Média" as Task["priority"],
  dueDate: "",
  assigneeId: "" as string | undefined,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(() => props.task, (task) => {
  if (task) {
    form.value = {
      ...task,
      dueDate: task.dueDate?.toISOString().split("T")[0] || "",
      assigneeId: task.assigneeId ?? ""
    };
  }
});

watch(isOpen, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

const isValid = computed(() => {
  return form.value.title.length >= 3 &&
    form.value.description.length >= 10 &&
    usersStore.users.length > 0;
});

const handleSubmit = () => {
  if (!form.value.title || !usersStore.users.length) return;

  const taskData: Task = {
    ...form.value,
    createdAt: props.task?.createdAt || new Date(),
    dueDate: form.value.dueDate ? new Date(form.value.dueDate) : undefined,
    assigneeId: form.value.assigneeId || undefined
  };

  if (props.task) {
    tasksStore.updateTask(taskData as Task);
  } else {
    tasksStore.createTask(taskData as Omit<Task, "id" | "createdAt">);
  }

  emit("saved");
  isOpen.value = false;
};

const resetForm = () => {
  form.value = {
    id: "",
    title: "TASK-",
    description: "",
    status: "Pendente",
    priority: "Média",
    dueDate: "",
    assigneeId: "",
  };
};

const minDate = computed(() => new Date().toISOString().split("T")[0]);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ task ? 'Editar Tarefa' : 'Nova Tarefa' }}</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="title">Título</Label>
          <Input id="title" v-model="form.title" />
        </div>

        <div class="grid gap-2">
          <Label for="description">Descrição</Label>
          <Textarea id="description" v-model="form.description" rows="4" />
        </div>

        <div class="grid gap-2">
          <Label for="status">Status</Label>
          <Select v-model="form.status">
            <SelectTrigger>
              <SelectValue />
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
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label for="priority">Prioridade</Label>
          <Select v-model="form.priority">
            <SelectTrigger>
              <SelectValue />
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
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label for="dueDate">Data de Conclusão</Label>
          <Input id="dueDate" type="date" v-model="form.dueDate"
            :class="{ 'text-gray-900': !themeStore.isDark, 'text-white': themeStore.isDark }" />
        </div>

        <div class="grid gap-2">
          <Label for="assignee">Responsável</Label>
          <Select v-model="form.assigneeId">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="user in usersStore.users" :key="user.id" :value="user.id">
                {{ user.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="flex justify-end gap-4">
        <Button variant="outline" @click="isOpen = false">
          Cancelar
        </Button>
        <Button @click="handleSubmit">
          {{ task ? 'Salvar Alterações' : 'Criar Tarefa' }}
        </Button>
      </div>

      <div v-if="!isValid" class="text-sm text-red-500">
        <p v-if="form.title.length < 3">
          Título precisa ter pelo menos 3 caracteres
        </p>
        <p v-if="form.description.length < 10">
          Descrição precisa ter pelo menos 10 caracteres
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
