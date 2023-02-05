<script>
import { computed, defineComponent, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import CardHomeItem from "./CardHomeItem.vue";

export default defineComponent({
  components: {
    CardHomeItem,
  },
  setup() {
    const store = useStore();

    const posts = computed(() => store.state["post"].posts);
    const filters = computed(() => store.state["post"].filters);
    const pagination = computed(() => store.state["post"].pagination);

    onMounted(() => {
      if (filters.value.page >= pagination.value.totalRows) return;

      store.dispatch("post/fetchAllPost", {
        ...filters.value,
        limit: 2,
        isHome: true,
      });
    });

    const visibilityChanged = (isVisibilityChanged) => {
      if (!isVisibilityChanged) return;

      let oldPage = filters.value.page;

      if (oldPage >= pagination.value.totalRows) return;

      store.dispatch("post/changeFilter", {
        page: ++oldPage,
      });

      store.dispatch("post/fetchAllPost", {
        ...filters.value,
        isHome: true,
      });
    };

    return {
      posts,
      visibilityChanged,
    };
  },
});
</script>

<template>
  <v-card class="mx-auto">
    <v-card-title class="text-h4">Danh sách bài viết</v-card-title>
    <v-container>
      <v-row dense>
        <card-home-item v-for="post in posts" :key="post._id" :item="post" />

        <div v-if="posts.length" v-observe-visibility="visibilityChanged"></div>
      </v-row>
    </v-container>
  </v-card>
</template>
