<script setup>
import MenuList from "../../../components/manager/MenuList.vue";

const desserts = [
  {
    name: "Frozen Yogurt",
    calories: 159,
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
  },
  {
    name: "Eclair",
    calories: 262,
  },
  {
    name: "Cupcake",
    calories: 305,
  },
  {
    name: "Gingerbread",
    calories: 356,
  },
  {
    name: "Jelly bean",
    calories: 375,
  },
];

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

      <v-table>
        <thead>
          <tr>
            <th class="text-left">Tên danh mục</th>
            <th class="text-left">Slug</th>
            <th class="text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.calories }}</td>
            <th><menu-list :items="items" /></th>
          </tr>
        </tbody>
      </v-table>

      <div class="text-center">
        <v-pagination v-model="page" :length="6"></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>
