<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import SidebarLeft from "../components/SidebarLeft.vue";

export default defineComponent({
  components: {
    SidebarLeft,
  },
  setup() {
    const drawer = ref(null);
    const theme = ref(localStorage.getItem("theme") || "light");
    const store = useStore();
    const color = "success";

    const user = computed(() =>
      Object.keys(store.state.auth.user).length === 0
        ? null
        : store.state.auth.user
    );

    onMounted(() => {
      store.dispatch("category/fetchAllWtihChildrenCategory");
    });

    function onClick() {
      theme.value = theme.value === "light" ? "dark" : "light";
      localStorage.setItem("theme", theme.value);
    }

    return {
      onClick,
      theme,
      drawer,
      user,
      color,
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

      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        @click="onClick"
      >
      </v-btn>

      <router-link class="text-decoration-none" to="/login">
        <v-btn variant="flat">Đăng nhập</v-btn>
      </router-link>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
