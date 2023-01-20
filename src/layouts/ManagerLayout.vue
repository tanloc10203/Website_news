<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import authApi from "../api/authApi";

const drawer = ref(null);
const links = ref([
  ["mdi-inbox-arrow-down", "Dashboard", "/manager/dashboard"],
  ["mdi-send", "Category", "/manager/category"],
]);
const store = useStore();
const user = computed(() =>
  Object.keys(store.state.auth.user).length === 0 ? null : store.state.auth.user
);

const getCurrentUserLogin = async () => {
  try {
    if (store.state.auth.accessToken) {
      const response = await authApi.getCurrentUser(
        store.state.auth.accessToken
      );
      if (response.elements) {
        store.dispatch("auth/saveUser", response.elements);
      }
    }
  } catch (error) {
    console.log("error getCurrentUserLogin:::", error);
    throw new Error(error.message);
  }
};

getCurrentUserLogin();
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Hello, {{ user && user.email }}</v-toolbar-title>
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
