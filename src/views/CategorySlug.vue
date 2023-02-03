<script>
import { computed, defineComponent } from "@vue/runtime-core";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();

    const slug = computed(() => route.params?.slug);

    return {
      slug,
    };
  },
});
</script>

<template>
  <div>Category with slug = {{ slug }}</div>
</template>
