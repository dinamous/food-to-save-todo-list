import { defineStore } from "pinia";

export type TaskPriority = "Baixa" | "Média" | "Alta" | "all";
export type TaskStatus = "Pendente" | "Em progresso" | "Concluída" | "all";

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

interface TasksState {
  tasks: Task[];
  currentPage: number;
  pageSize: number;
  filters: TaskFilters;
  sorting: TaskSorting;
}

export const useTasksStore = defineStore("tasks", {
  state: (): TasksState => ({
    tasks: [],
    currentPage: 1,
    pageSize: 5,
    filters: {},
    sorting: {
      field: "createdAt",
      order: "desc",
    },
  }),

  actions: {
    initTasks() {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        try {
          this.tasks = JSON.parse(storedTasks).map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
        } catch (error) {
          console.error("Error parsing tasks:", error);
          this.tasks = [];
        }
      } else {
        this.tasks = [];
      }
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
      this.filters = {
        status:
          filters.status && filters.status !== "all"
            ? filters.status
            : undefined,
        priority:
          filters.priority && filters.priority !== "all"
            ? filters.priority
            : undefined,
      };
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

      if (state.filters.status) {
        tasks = tasks.filter((t) => t.status === state.filters.status);
      }

      if (state.filters.priority) {
        tasks = tasks.filter((t) => t.priority === state.filters.priority);
      }

      return tasks.sort((a, b) => {
        const field = state.sorting.field;
        const aValue = a[field];
        const bValue = b[field];
        const modifier = state.sorting.order === "asc" ? 1 : -1;

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
