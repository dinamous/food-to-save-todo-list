import { createRouter, createWebHistory } from "vue-router";

import AppLayout from "../pages/_layouts/TemplateApp.vue";

const routes = [

  {
    path: "/",
    component: AppLayout,
    meta: {
      title: "Dashboard"
    }
  }


]


const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + " | Task to Save"
  next()
})

export default router;