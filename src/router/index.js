import { createRouter, createWebHistory } from "vue-router";

import AppLayout from "@/pages/_layouts/TemplateApp.vue";
import Dashboard from "@/pages/app/DashboardPage.vue";
import NotFound from "@/pages/app/NotFound.vue";
import Tasks from "@/pages/app/TasksPage.vue";
import Users from "@/pages/app/UsersPage.vue";

const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound, meta: { title: "Error 404" } },
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
        meta: { title: "Dashboard" }
      },
      {
        path: "tasks",
        name: "Tasks",
        component: Tasks,
        meta: { title: "Tarefas" }
      },
      {
        path: "users",
        name: "Users",
        component: Users,
        meta: { title: "Usuários" }
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + " | Task to Save";
  next();
});

export default router;
