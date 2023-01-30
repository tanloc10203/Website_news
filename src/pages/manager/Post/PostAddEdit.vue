<template>
  <v-row>
    <v-col>
      <h1 class="text-center">
        {{ isAddMode ? "Thêm" : "Cập nhật" }} bài viết
      </h1>

      <post-add-edit-form :isAddMode="isAddMode" />
    </v-col>
  </v-row>
</template>

<script>
import { computed, defineComponent } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import PostAddEditForm from "../../../components/manager/post/PostAddEditForm.vue";

export default defineComponent({
  components: {
    PostAddEditForm,
  },
  setup(props) {
    const route = useRoute();

    const isAddMode = computed(() => (!route.params?.id ? true : false));

    return {
      isAddMode,
    };
  },
});
</script>
