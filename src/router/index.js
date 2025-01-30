import { createRouter, createWebHistory } from "vue-router";

import AppLayout from "../pages/_layouts/TemplateApp.vue";

const routes = [

  {
    path: "/",
    component: AppLayout,
    // meta: { auth: false },

  }


]


const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + " | pizza.shop"
  next()
})

export default router;