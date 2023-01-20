import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import AboutView from "../views/AboutView.vue";
import Dashboard from "../pages/manager/Dashboard.vue";
import Category from "../pages/manager/Category.vue";
import FormLogin from "../components/FormLogin.vue";
import store from "@/store";

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
    component: FormLogin,
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
          auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
        },
      },
      {
        path: "category",
        name: "category",
        component: Category,
        meta: {
          layout: "ManagerLayout",
          auth: true,
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

router.beforeEach(async (to, form, next) => {
  const isLoggedIn = store.getters["auth/isLoggedIn"];

  if (to.path !== "/login" && !isLoggedIn) {
    next({
      name: "login",
    });
  }

  if (to.path === "/login" && isLoggedIn) {
    next({
      name: "dashboard",
    });
  }

  next();
});

export default router;
