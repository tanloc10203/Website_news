<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import categoryApi from "../../../api/categoryApi";
import FormCategoryAddEdit from "../../../components/manager/category/FormCategoryAddEdit.vue";

const route = useRoute();
const params = route.params;
const categorySelected = ref();

const isModeUpdate = computed(() => (params?.categoryId ? true : false));

console.log(isModeUpdate);

const getCategoryById = async (id) => {
  try {
    const response = await categoryApi.getById(id);
    if (response && response.elements) {
      categorySelected.value = response.elements;
    }
  } catch (error) {
    console.log("error getCategoryById:::", error);
  }
};

onMounted(() => {
  if (params?.categoryId) {
    getCategoryById(params.categoryId);
  }
});
</script>

<template>
  <v-row>
    <v-col>
      <h1 class="text-center">
        {{ isModeUpdate ? "Cập nhật" : "Thêm" }} danh mục
      </h1>

      <form-category-add-edit
        v-if="isModeUpdate"
        :selected="categorySelected ? categorySelected : {}"
      />
      <form-category-add-edit v-else />
    </v-col>
  </v-row>
</template>
