<template>
  <form @submit.prevent="handleSubmit">
    <v-text-field
      type="text"
      label="Tiêu đề bài viết"
      v-model="title"
      :counter="max"
      :rules="ruleTitle"
    />

    <v-text-field v-model="slug" type="text" label="Slug danh mục" disabled />

    <v-select
      v-model="categoryId"
      label="Danh mục"
      :items="categories"
      item-title="name"
      item-value="_id"
      @update:modelValue="handleChangeSelect"
    />

    <v-btn
      type="submit"
      :disabled="!title || !categoryId"
      color="success"
      class="mt-5 d-block"
    >
      {{ isAddMode ? "Tạo Bài Viết" : "Lưu Bài Viết" }}
    </v-btn>
  </form>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  watch,
  onBeforeMount,
} from "@vue/runtime-core";
import slugify from "slugify";
import { useStore } from "vuex";
import { emptyObject } from "../../../utils/functions";

export default defineComponent({
  props: {
    isAddMode: {
      type: Boolean,
    },
  },
  setup({ isAddMode }) {
    const store = useStore();

    const title = ref("");
    const slug = ref("");
    const categoryId = ref("");

    let errors = {};
    const max = 200;
    const ruleTitle = [
      (v) => !!v || "Tên tiêu đề là trường bắt buộc",
      (v) =>
        (v && v.length <= max) || `Tên tiêu đề không vượt quá ${max} kí tự`,
    ];

    const user = computed(() => store.state["auth"].user);
    const categories = computed(() => [
      { _id: "", name: "Vui lòng chọn danh mục" },
      ...store.state["category"].categories,
    ]);

    onBeforeMount(() => {
      store.dispatch("category/fetchAllCategory", { page: 1, limit: 100 });
    });

    watch(title, (titleNew) => {
      slug.value = slugify(titleNew, { locale: "vi" });
      titleNew.length >= max ? (errors["title"] = true) : (errors = {});
    });

    watch(categoryId, (categoryId) => {
      !categoryId ? (errors["categoryId"] = true) : (errors = {});
    });

    const handleChangeSelect = (value) => {
      console.log("check value categoryId:::", value);
    };

    const handleSubmit = () => {
      if (emptyObject(errors)) {
        const data = {
          title: title.value,
          slug: slug.value,
          categoryId: categoryId.value,
          userId: user.value._id,
        };

        console.log(data);
      }
    };

    return {
      title,
      ruleTitle,
      max,
      slug,
      categoryId,
      categories,
      isAddMode,
      handleChangeSelect,
      handleSubmit,
    };
  },
});
</script>
