<template>
  <v-menu open-on-hover transition="scale-transition">
    <template v-slot:activator="{ props }">
      <button v-bind="props">
        <v-icon>mdi-dots-vertical</v-icon>
      </button>
    </template>

    <v-list>
      <v-list-item active-color="primary" variant="plain" class="cursor-point">
        <v-list-item-title>
          <router-link
            class="text-decoration-none text-error"
            :to="`/manager/category/add/children/${selected._id}`"
          >
            Thêm danh mục con
          </router-link>
        </v-list-item-title>
        <v-list-item-title
          v-text="`Hiện danh mục con`"
          class="text-success"
          @click="onShowChildren(selected)"
        />
        <v-list-item-title>
          <router-link
            class="text-decoration-none text-black"
            :to="`/manager/category/update/${selected._id}`"
          >
            Sửa danh mục
          </router-link>
        </v-list-item-title>
        <v-list-item-title
          v-text="`Xoá danh mục`"
          @click="onOpenDelete(selected)"
        />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    selected: {
      type: Object,
      required: true,
    },
    onOpenDelete: {
      type: Function,
    },
    onShowChildren: {
      type: Function,
    },
  },
});
</script>
