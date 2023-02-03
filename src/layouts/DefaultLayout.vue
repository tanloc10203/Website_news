<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const drawer = ref(null);
    const theme = ref(localStorage.getItem("theme") || "light");
    const store = useStore();
    const router = useRouter();
    const color = "success";
    const items = [
      {
        title: "Convênios",
        icon: "mdi-clipboard-outline",
        to: "/convenios",
      },
      {
        title: "Planos",
        icon: "mdi-format-font",
        items: [
          {
            title: "Test1",
            icon: "mdi-chart-bubble",
            items: [
              {
                title: "Test4",
                icon: "mdi-chart-bubble",
                to: "/test1",
              },
              {
                title: "Test5",
                icon: "mdi-chart-bubble",
                to: "/test2",
              },
            ],
          },
          {
            title: "Test2",
            icon: "mdi-chart-bubble",
            to: "/test2",
          },
        ],
      },
    ];

    const categories = computed(() => store.state["category"].categories);

    onBeforeMount(() => {
      store.dispatch("category/fetchAllWtihChildrenCategory");
    });

    console.log(categories);

    const user = computed(() =>
      Object.keys(store.state.auth.user).length === 0
        ? null
        : store.state.auth.user
    );

    function onClick() {
      theme.value = theme.value === "light" ? "dark" : "light";
      localStorage.setItem("theme", theme.value);
    }

    return {
      onClick,
      theme,
      drawer,
      categories,
      user,
      items,
      color,
    };
  },
});
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/">App News</router-link>
      </v-toolbar-title>

      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        @click="onClick"
      >
      </v-btn>

      <router-link class="text-decoration-none" to="/login">
        <v-btn variant="flat">Đăng nhập</v-btn>
      </router-link>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary width="350">
      <v-list-item v-for="category in categories" :key="category._id" link>
        <router-link
          :to="`/category/${category.slug}`"
          class="d-block text-decoration-none"
        >
          <v-list-item-title> {{ category.name }} </v-list-item-title>
        </router-link>

        <!-- Sub Category -->
        <div v-if="category?.childrens && category?.childrens.length > 0">
          <v-list-item
            v-for="subCat in category.childrens"
            :key="subCat._id"
            link
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-minus" size="x-small"></v-icon>
            </template>
            <router-link
              :to="`/category/${subCat.slug}`"
              class="d-block text-decoration-none"
            >
              <v-list-item-title> {{ subCat.name }} </v-list-item-title>

              <!-- Sub sub Category -->
              <div v-if="subCat?.childrens && subCat?.childrens.length > 0">
                <v-list-item
                  v-for="subSubCat in subCat.childrens"
                  :key="subSubCat._id"
                  link
                >
                  <template v-slot:prepend>
                    <v-icon icon="mdi-plus" size="x-small"></v-icon>
                  </template>

                  <router-link
                    :to="`/category/${subSubCat.slug}`"
                    class="d-block text-decoration-none"
                  >
                    <v-list-item-title>
                      {{ subSubCat.name }}
                    </v-list-item-title>
                  </router-link>
                </v-list-item>
              </div>
              <!-- End Sub sub category -->
            </router-link>
          </v-list-item>
        </div>
        <!-- End Sub category -->
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
