import { createApp } from "vue";
import App from "./App.vue";
import { createWebHashHistory, createRouter } from "vue-router";

import Study from "@/components/Study.vue";
import Calendar from "@/components/Calendar.vue";
import Todo from "@/components/sub/Todo.vue";
import Concentration from "@/components/sub/Concentration.vue";

import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
import 'element-plus/dist/index.css';

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

const routes = [
  { path: "/", component: Calendar },
  { path: "/calendar", component: Calendar },
  {
    path: "/study", component: Study, children: [
      { path: "todo", component: Todo },
      { path: "", component: Todo },
      {
        path: "concentrate", component: Concentration, props: (route) => {
          return { index: route.query.index }
        }
      }
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App).use(router).use(ElementPlus, {
  locale: zhCn,
}).mount("#app");