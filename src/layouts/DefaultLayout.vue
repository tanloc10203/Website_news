<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import authApi from "../api/authApi";
import { emptyObject } from "../utils/functions";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const drawer = ref(null);
    const theme = ref(localStorage.getItem("theme") || "light");

    const user = computed(() =>
      emptyObject(store.state.auth.user) ? null : store.state.auth.user
    );

    const isHome = computed(() => (!route.meta?.auth ? true : false));

    const handleLogout = async () => {
      try {
        const response = await authApi.signOut();
        if (response) {
          store.dispatch("auth/remove");
          router.push("/login");
        }
      } catch (error) {
        console.log("error handleLogout:::", error);
        throw new Error(error.message);
      }
    };

    onMounted(() => {
      if (isHome.value) {
        store.dispatch("category/fetchAllWtihChildrenCategory");
      }
    });

    watch(isHome, (isHome) => {
      if (isHome) {
        store.dispatch("category/fetchAllWtihChildrenCategory");
        store.dispatch("auth/saveUser", {});
      }
    });

    function onClick() {
      theme.value = theme.value === "light" ? "dark" : "light";
      localStorage.setItem("theme", theme.value);
    }

    return {
      onClick,
      handleLogout,
      theme,
      drawer,
      user,
      isHome,
    };
  },
});
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/">App News</router-link>
      </v-toolbar-title>

      <v-toolbar-title v-if="user"
        >Hello, {{ user && user.email }}</v-toolbar-title
      >

      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        @click="onClick"
      >
      </v-btn>

      <router-link v-if="isHome" class="text-decoration-none" to="/manager">
        <v-btn variant="flat">Quản trị bài viết</v-btn>
      </router-link>

      <v-btn v-else-if="user" variant="flat" @click="handleLogout">
        Đăng xuất
      </v-btn>

      <router-link v-else class="text-decoration-none" to="/login">
        <v-btn variant="flat">Đăng nhập</v-btn>
      </router-link>
    </v-app-bar>

    <router-view name="sidebar" :drawer="drawer" />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
