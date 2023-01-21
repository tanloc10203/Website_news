<template>
  <v-menu open-on-hover transition="scale-transition">
    <template v-slot:activator="{ props }">
      <button v-bind="props">
        <v-icon>mdi-dots-vertical</v-icon>
      </button>
    </template>

    <v-card class="mx-auto" max-width="300">
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          active-color="primary"
          variant="plain"
          class="cursor-point"
        >
          <v-list-item-title v-text="item.title" />
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  items: {
    type: [Object],
    required: true,
  },
});
</script>
