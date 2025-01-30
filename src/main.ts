import "./global.css";

import { createHead } from "@unhead/vue";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
const head = createHead();
const pinia = createPinia();

import i18n from "./i18n";
import router from "./router/index";

createApp(App).use(pinia).use(router).use(head).use(i18n).mount("#app");
