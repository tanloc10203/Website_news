<script>
import { defineComponent, ref, watch } from "@vue/runtime-core";

export default defineComponent({
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const links = [
      ["mdi-inbox-arrow-down", "Dashboard", "/manager/dashboard"],
      ["mdi-send", "Quản lý danh mục", "/manager/category"],
      ["mdi-send", "Quản lý bài viết", "/manager/post"],
    ];

    const open = ref(false);

    watch(
      () => props.drawer,
      (drawer) => {
        open.value = drawer;
      }
    );

    return { links, open };
  },
});
</script>

<template>
  <v-navigation-drawer v-model="open" temporary>
    <v-list-item v-for="[icon, text, to] in links" :key="icon" link>
      <template v-slot:prepend>
        <v-icon>{{ icon }}</v-icon>
      </template>

      <router-link :to="to" class="d-block text-decoration-none">
        <v-list-item-title> {{ text }} </v-list-item-title>
      </router-link>
    </v-list-item>
  </v-navigation-drawer>
</template>
