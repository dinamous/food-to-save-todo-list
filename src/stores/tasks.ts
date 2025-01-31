// src/stores/tasks.ts
import { defineStore } from "pinia";

import { useUsersStore } from "./users";

type TaskStatus = "Pendente" | "Em progresso" | "Concluída";
type TaskPriority = "Baixa" | "Média" | "Alta";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  dueDate?: Date;
  assigneeId?: string;
}

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
}

interface TaskSorting {
  field: keyof Task;
  order: "asc" | "desc";
}

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
    currentPage: 1,
    pageSize: 5,
    filters: {} as TaskFilters,
    sorting: {
      field: "createdAt" as keyof Task,
      order: "desc" as "asc" | "desc",
    },
  }),

  actions: {
    initTasks() {
      const storedTasks = localStorage.getItem("tasks");
      this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    },

    createTask(task: Omit<Task, "id" | "createdAt">) {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      this.tasks.push(newTask);
      this.persistTasks();
    },

    updateTask(updatedTask: Task) {
      const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.persistTasks();
      }
    },

    deleteTask(taskId: string) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
      this.persistTasks();
    },

    setFilters(filters: TaskFilters) {
      this.filters = filters;
    },

    setSorting(field: keyof Task, order: "asc" | "desc") {
      this.sorting = { field, order };
    },

    setPage(page: number) {
      this.currentPage = page;
    },

    setPageSize(size: number) {
      this.pageSize = size;
    },

    persistTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
  },

  getters: {
    filteredTasks(state): Task[] {
      let tasks = [...state.tasks];

      // Aplicar filtros
      if (state.filters.status) {
        tasks = tasks.filter((t) => t.status === state.filters.status);
      }

      if (state.filters.priority) {
        tasks = tasks.filter((t) => t.priority === state.filters.priority);
      }

      // Ordenação segura
      return tasks.sort((a, b) => {
        const field = state.sorting.field;
        const aValue = a[field];
        const bValue = b[field];
        const modifier = state.sorting.order === "asc" ? 1 : -1;

        // Tratar campos opcionais
        if (aValue instanceof Date && bValue instanceof Date) {
          return (aValue.getTime() - bValue.getTime()) * modifier;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue) * modifier;
        }

        return 0;
      });
    },

    paginatedTasks(state): Task[] {
      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;
      return this.filteredTasks.slice(start, end);
    },

    totalPages(state): number {
      return Math.ceil(this.filteredTasks.length / state.pageSize);
    },
  },
});
