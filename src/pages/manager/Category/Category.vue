<script setup>
import MenuList from "../../../components/manager/MenuList.vue";
import { useStore } from "vuex";
import { onMounted, computed, ref } from "vue";
import categoryApi from "../../../api/categoryApi";
import Toast from "../../../components/Toast.vue";

const store = useStore();

const categories = computed(() => store.state.category.categories);
const isLoading = computed(() => store.state.category.isLoading);
const selected = ref();
const dialog = ref(false);

onMounted(() => {
  store.dispatch("category/fetchAllCategory");
});

const handleOpenDelete = (category) => {
  selected.value = category;
  dialog.value = true;
};

const handleDelete = async (category) => {
  try {
    dialog.value = false;
    const response = await categoryApi.delete({ id: category._id });
    if (response) {
      store.dispatch("category/fetchAllCategory");
    }
  } catch (error) {
    console.log("handleDelete error:::", error);
  }
};

const page = 1;

const items = [
  { title: "Thêm danh mục con" },
  { title: "Hiện danh mục con" },
  { title: "Xoá danh mục" },
  { title: "Sửa danh mục" },
];
</script>

<template>
  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">
        <h1 class="mb-5">Danh mục</h1>

        <router-link class="text-decoration-none" to="/manager/category/add">
          <v-btn>Thêm danh mục</v-btn>
        </router-link>
      </div>

      <div class="position-relative">
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="green"
          class="position-absolute"
        />

        <v-table>
          <thead>
            <tr>
              <th class="text-left">Tên danh mục</th>
              <th class="text-left">Slug</th>
              <th class="text-left">Level</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categories" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.slug }}</td>
              <td>{{ item.level }}</td>
              <th class="text-center">
                <v-btn>Thêm danh mục con</v-btn>
                <v-btn color="blue-grey">Hiện danh mục con</v-btn>
                <router-link :to="`/manager/category/update/${item._id}`">
                  <v-btn color="primary">Sửa danh mục</v-btn>
                </router-link>
                <v-btn color="error" @click="handleOpenDelete(item)"
                  >Xoá danh mục</v-btn
                >
              </th>
            </tr>
          </tbody>
        </v-table>
      </div>

      <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
          <v-card-title class="text-h5"> Xác nhận trước khi xoá </v-card-title>
          <v-card-text
            >Bạn có muốn xoá danh mục
            <strong>`{{ selected.name }}`</strong></v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="dialog = false">
              Huỷ
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="handleDelete(selected)"
            >
              Xoá
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="text-center">
        <v-pagination v-model="page" :length="6"></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>
