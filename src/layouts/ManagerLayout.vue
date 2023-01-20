<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import authApi from "../api/authApi";

const drawer = ref(null);
const links = ref([
  ["mdi-inbox-arrow-down", "Dashboard", "/manager/dashboard"],
  ["mdi-send", "Category", "/manager/category"],
]);

const store = useStore();
const router = useRouter();

const user = computed(() =>
  Object.keys(store.state.auth.user).length === 0 ? null : store.state.auth.user
);

store.dispatch("auth/getCurrentUserLogin");

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
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Hello, {{ user && user.email }}</v-toolbar-title>

      <v-btn variant="flat" @click="handleLogout">Đăng xuất</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item v-for="[icon, text, to] in links" :key="icon" link>
        <template v-slot:prepend>
          <v-icon>{{ icon }}</v-icon>
        </template>

        <router-link :to="to" class="d-block">
          <v-list-item-title> {{ text }} </v-list-item-title>
        </router-link>
      </v-list-item>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
