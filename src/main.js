import { createApp } from "vue";
import App from "./App.vue";
import { createMemoryHistory, createRouter } from "vue-router";
import CourseList from "./components/CourseList.vue";
import BoyaList from "./components/BoyaList.vue";
import Profile from "./components/Profile.vue";
import jsonDatabase from "../db/db.json" with { type: "json" };

let db = localStorage.getItem("db");
if (db === null) {  
  localStorage.setItem("db", JSON.stringify(jsonDatabase));
}

const routes = [
	{ path: "/", component: CourseList },
	{ path: "/boya", component: BoyaList },
	{ path: "/profile", component: Profile },
];

const router = createRouter({
	history: createMemoryHistory(),
	routes,
});

createApp(App).use(router).mount("#app");
