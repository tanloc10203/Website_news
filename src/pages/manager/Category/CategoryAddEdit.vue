<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const params = route.params;

const isModeUpdate = computed(() => (params?.categoryId ? true : false));
</script>

<template>
  <v-row>
    <v-col>
      <h1 class="text-center">
        {{ isModeUpdate ? "Cập nhật" : "Thêm" }} danh mục
      </h1>
    </v-col>
  </v-row>
</template>
