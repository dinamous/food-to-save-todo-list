import './global.css';

import { createHead } from '@unhead/vue';
import { createApp } from 'vue';

import App from './App.vue';
const head = createHead();

import router from './router/index';

createApp(App)
  .use(router)
  .use(head)
  .mount('#app');

