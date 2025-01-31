import { defineStore } from "pinia";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    addUser(user: Omit<User, "id">) {
      const newUser = {
        ...user,
        id: crypto.randomUUID(),
      };
      this.users.push(newUser);
      this.persistUsers();
    },
    persistUsers() {
      localStorage.setItem("users", JSON.stringify(this.users));
    },
    initUsers() {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
    },
  },
});
