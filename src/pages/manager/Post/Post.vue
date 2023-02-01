<script>
import { computed, defineComponent, onBeforeMount } from "@vue/runtime-core";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const posts = computed(() => store.state["post"].posts);
    const filters = computed(() => store.state["post"].filters);
    const pagination = computed(() => store.state["post"].pagination);
    const isLoading = computed(() => store.state["post"].isLoading);
    const URL = computed(() => process.env.VUE_APP_ENDPOINT_URL);

    onBeforeMount(() => {
      store.dispatch("post/fetchAllPost", {
        ...filters.value,
        page: 1,
        limit: 10,
      });
    });

    const onChangePage = (value) => {
      store.dispatch("post/fetchAllPost", {
        ...filters.value,
        page: value,
      });
    };

    return {
      onChangePage,
      posts,
      URL,
      isLoading,
      pagination,
    };
  },
});
</script>

<template>
  <v-row>
    <v-col>
      <div class="d-flex justify-space-between">
        <h1 class="mb-5">Danh sách bài viết</h1>

        <router-link class="text-decoration-none" to="/manager/post/add">
          <v-btn>Thêm bài viết</v-btn>
        </router-link>
      </div>

      <div class="position-relative">
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="green"
          class="position-absolute"
        />

        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Tiêu đề</th>
              <th class="text-center">Ảnh tiêu đề</th>
              <th class="text-center">Nội dung</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post._id">
              <td>
                <p class="text-truncate" style="max-width: 400px">
                  {{ post.title }}
                </p>
              </td>
              <td>
                <v-sheet
                  class="rounded p-2 mx-auto"
                  max-width="100"
                  elevation="12"
                  height="100%"
                  width="100%"
                >
                  <v-img :src="`${URL}/${post.image_title}`" />
                </v-sheet>
              </td>
              <td>
                <p class="text-truncate mx-auto" style="max-width: 400px">
                  {{ post.detail_html }}
                </p>
              </td>
              <td>
                <v-btn>Sửa</v-btn>
                <v-btn>Xoá</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <!-- <v-dialog v-model="dialog" persistent max-width="500">
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
      </v-dialog> -->

      <div class="text-center">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalRows"
          @update:modelValue="onChangePage"
        ></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>
