<script setup>
import { useRoute } from "vue-router";
import { watch, ref, markRaw, computed, onMounted } from "vue";
import Toast from "./components/Toast.vue";
import { useStore } from "vuex";

const defaultLayout = "DefaultLayout";
const route = useRoute();
const store = useStore();
const layout = ref();

const text = computed(() => store.state["toast"].text);
const open = computed(() => store.state["toast"].open);
const color = computed(() => store.state["toast"].color);

watch(
  () => store.state["toast"].open,
  (open) => {
    if (open) {
      setTimeout(() => store.dispatch("toast/saveOpen", { open: false }), 1504);
    }
  }
);

watch(
  () => route.meta?.layout,
  async (metaLayout) => {
    try {
      let component;

      if (metaLayout) {
        component = await import(`./layouts/${metaLayout}.vue`);
      } else {
        component = await import(`./layouts/${defaultLayout}.vue`);
      }

      layout.value = markRaw(component?.default);
    } catch (e) {
      let component = await import(`./layouts/${defaultLayout}.vue`);
      layout.value = markRaw(component);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <component :is="layout">
    <router-view />

    <Toast v-if="open" :open="open" :color="color" :text="text" />
  </component>
</template>

<style>
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
