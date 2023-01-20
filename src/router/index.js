import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import AboutView from "../views/AboutView.vue";
import Dashboard from "../pages/manager/Dashboard.vue";
import Category from "../pages/manager/Category.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "LoginLayout",
    },
  },
  {
    path: "/manager",
    name: "manager",
    redirect: { name: "dashboard" },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: {
          layout: "ManagerLayout",
        },
      },
      {
        path: "category",
        name: "category",
        component: Category,
        meta: {
          layout: "ManagerLayout",
        },
      },
    ],
  },
  {
    path: "/404",
    name: "notfound",
    component: NotFoundView,
    meta: {
      layout: "NotFoundLayout",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "notfound" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
