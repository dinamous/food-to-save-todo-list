import { defineStore } from "pinia";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    currentPage: 1,
    pageSize: 5,
  }),

  actions: {
    initUsers() {
      const storedUsers = localStorage.getItem("users");
      this.users = storedUsers ? JSON.parse(storedUsers) : [];
    },

    addUser(user: Omit<User, "id">) {
      const newUser = {
        ...user,
        id: crypto.randomUUID(),
      };
      this.users.push(newUser);
      this.persistUsers();
    },

    deleteUser(userId: string) {
      this.users = this.users.filter((user) => user.id !== userId);
      this.persistUsers();
    },

    updateUser(updatedUser: User) {
      const index = this.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.persistUsers();
      }
    },

    setPage(page: number) {
      this.currentPage = page;
    },

    setPageSize(size: number) {
      this.pageSize = size;
      this.currentPage = 1;
    },

    persistUsers() {
      localStorage.setItem("users", JSON.stringify(this.users));
    },
  },

  getters: {
    paginatedUsers: (state) => {
      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;
      return state.users.slice(start, end);
    },
    totalPages: (state) => Math.ceil(state.users.length / state.pageSize),
  },
});
