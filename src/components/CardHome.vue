<script>
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import CardHomeItem from "./CardHomeItem.vue";

export default defineComponent({
  components: {
    CardHomeItem,
  },
  setup() {
    const store = useStore();

    const posts = computed(() => store.state["post"].posts);

    onMounted(() => {
      store.dispatch("post/fetchAllPost", { page: 1, limit: 10 });
    });

    return {
      posts,
    };
  },
});
</script>

<template>
  <v-card class="mx-auto">
    <v-container>
      <v-row dense>
        <card-home-item v-for="post in posts" :key="post._id" :item="post" />
      </v-row>
    </v-container>
  </v-card>
</template>
