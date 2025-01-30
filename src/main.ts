import "./global.css";

import { createHead } from "@unhead/vue";
import { createApp } from "vue";

import App from "./App.vue";
const head = createHead();

import i18n from "./i18n";
import router from "./router/index";

createApp(App).use(router).use(head).use(i18n).mount("#app");
