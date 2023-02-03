import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () =>
      import(
        /* webpackChunkName: "DefaultLayout" */ "../layouts/DefaultLayout.vue"
      ),
    children: [
      {
        path: "",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "HomView" */ "../views/HomeView.vue"),
      },
      {
        path: "about",
        name: "about",
        component: () =>
          import(/* webpackChunkName: "AboutView" */ "../views/AboutView.vue"),
      },
      {
        path: "login",
        component: () =>
          import(
            /* webpackChunkName: "LoginLayout" */ "../layouts/LoginLayout.vue"
          ),
        children: [
          {
            path: "",
            name: "login",
            component: () =>
              import(
                /* webpackChunkName: "FormLogin" */ "../components/FormLogin.vue"
              ),
          },
        ],
      },
      {
        path: "manager",
        redirect: { name: "dashboard" },
        component: () =>
          import(
            /* webpackChunkName: "ManagerLayout" */ "../layouts/ManagerLayout.vue"
          ),
        children: [
          {
            path: "dashboard",
            name: "dashboard",
            component: () =>
              import(
                /* webpackChunkName: "Dashboard" */ "../pages/manager/Dashboard.vue"
              ),
            meta: {
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
                  auth: true,
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
                  auth: true,
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
                  auth: true,
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
                  auth: true,
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
                  auth: true,
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
                  auth: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/password",
    component: () =>
      import(
        /* webpackChunkName: "LoginLayout" */ "../layouts/LoginLayout.vue"
      ),
    children: [
      {
        path: "forgot",
        name: "forgot-password",
        component: () =>
          import(
            /* webpackChunkName: "ForgotPassword" */ "../views/ForgotPassword.vue"
          ),
      },
      {
        path: "change/:email",
        name: "change-password",
        component: () =>
          import(
            /* webpackChunkName: "ForgotPassword" */ "../views/ChangePassword.vue"
          ),
      },
    ],
  },
  {
    path: "/404",
    component: () =>
      import(
        /* webpackChunkName: "NotFoundLayout" */ "../layouts/NotFoundLayout.vue"
      ),
    children: [
      {
        path: "",
        name: "notfound",
        component: () =>
          import(
            /* webpackChunkName: "NotFoundView" */ "../views/NotFoundView.vue"
          ),
      },
    ],
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
  if (to.meta?.auth) {
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
