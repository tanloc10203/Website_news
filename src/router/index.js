import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";
import homeRouteConfig from "./homeRoute";
import managerRouteConfig from "./managerRoute";
import notfoundRouteConfig from "./notFoundRoute";
import passwordRouteConfig from "./passwordRoute";

const routes = [
  ...homeRouteConfig,
  ...managerRouteConfig,
  ...passwordRouteConfig,
  ...notfoundRouteConfig,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, form, next) => {
  if (to.meta?.auth) {
    store.dispatch("auth/getCurrentUserLogin").catch(async (error) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors.message !== "jwt expired"
      ) {
        await handleLogout();
      }
    });

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
  }

  next();
});

export default router;
