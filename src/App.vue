<script setup>
import { useRoute } from "vue-router";
import { watch, ref, markRaw } from "vue";

const defaultLayout = "DefaultLayout";
const route = useRoute();
const layout = ref();

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
  <div>
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<style>
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
