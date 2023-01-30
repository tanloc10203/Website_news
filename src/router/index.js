import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "HomView" */ "../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "AboutView" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "FormLogin" */ "../components/FormLogin.vue"),
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
        component: () =>
          import(
            /* webpackChunkName: "Dashboard" */ "../pages/manager/Dashboard.vue"
          ),
        meta: {
          layout: "ManagerLayout",
          auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
        },
      },
      {
        path: "category",
        children: [
          {
            path: "",
            name: "category",
            component: () =>
              import(
                /* webpackChunkName: "Category" */ "../pages/manager/Category/Category.vue"
              ),
            meta: {
              layout: "ManagerLayout",
              auth: true,
            },
          },
          {
            path: "add",
            name: "add-category",
            component: () =>
              import(
                /* webpackChunkName: "AddCategory" */ "../pages/manager/Category/CategoryAddEdit.vue"
              ),
            meta: {
              layout: "ManagerLayout",
              auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
            },
          },
          {
            path: "add/children/:parentId",
            name: "add-children-category",
            component: () =>
              import(
                /* webpackChunkName: "AddCategory" */ "../pages/manager/Category/CategoryAddEdit.vue"
              ),
            meta: {
              layout: "ManagerLayout",
              auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
            },
          },
          {
            path: "update/:categoryId",
            name: "update-category",
            component: () =>
              import(
                /* webpackChunkName: "UpdateCategory" */ "../pages/manager/Category/CategoryAddEdit.vue"
              ),
            meta: {
              layout: "ManagerLayout",
              auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
            },
          },
        ],
      },
      {
        path: "post",
        children: [
          {
            path: "",
            name: "post",
            component: () =>
              import(
                /* webpackChunkName: "Post" */ "../pages/manager/Post/Post.vue"
              ),
            meta: {
              layout: "ManagerLayout",
              auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
            },
          },
          {
            path: "add",
            name: "add-post",
            component: () =>
              import(
                /* webpackChunkName: "Post Add" */ "../pages/manager/Post/PostAddEdit.vue"
              ),
            meta: {
              layout: "ManagerLayout",
              auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
            },
          },
          {
            path: "update/:id",
            name: "update-post",
            component: () =>
              import(
                /* webpackChunkName: "Post Update" */ "../pages/manager/Post/PostAddEdit.vue"
              ),
            meta: {
              layout: "ManagerLayout",
              auth: true, // * Kiểm tra xem người dùng có đăng nhập chưa
            },
          },
        ],
      },
    ],
  },
  {
    path: "/404",
    name: "notfound",
    component: () =>
      import(
        /* webpackChunkName: "NotFoundView" */ "../views/NotFoundView.vue"
      ),
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
