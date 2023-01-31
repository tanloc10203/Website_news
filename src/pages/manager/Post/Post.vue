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
          indeterminate
          color="green"
          class="position-absolute"
        />

        <v-table>
          <thead>
            <tr>
              <th class="text-left">Tiêu đề</th>
              <th class="text-left">Ảnh tiêu đề</th>
              <th class="text-left">Slug</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody></tbody>
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
      </v-dialog>

      <div class="text-center">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalRows"
          @update:modelValue="changePage"
        ></v-pagination>
      </div> -->
    </v-col>
  </v-row>
</template>
