<script>
import { defineComponent, onMounted, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import authApi from "../api/authApi";
import OverlayCustomComponent from "../components/OverlayCustom.vue";

export default defineComponent({
  components: {
    OverlayCustomComponent,
  },
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const { email } = route.params;
    const { token } = route.query;
    const message = ref("");

    const verifyAccount = async ({ email, token }) => {
      try {
        const response = await authApi.verifyAccount({ email, token });
        console.log(response);
      } catch (error) {
        console.log("verifyAccount error :::", error);
        if (error.response) {
          message.value = error.response.data.errors.message;
        }
      }
    };

    onMounted(async () => {
      if (email && token) {
        verifyAccount({ email, token });
      }
    });

    return {
      loading,
      message,
    };
  },
});
</script>

<template>
  <v-row justify="center" align="center" style="min-height: 80vh">
    <v-col cols="6" align-self="center">
      <v-sheet class="pa-2 ma-2">
        <div v-if="!message">
          <v-alert type="success" variant="outlined">
            <template v-slot:title> Xác thực tài khoản thành công. </template>
          </v-alert>

          <v-btn class="mt-5">Đăng nhập</v-btn>
        </div>

        <div v-else>
          <v-alert variant="outlined" type="warning" prominent border="top">
            <template v-slot:title>
              Xác thực tài khoản không thành công.
            </template>

            {{ message }}
          </v-alert>

          <v-btn class="mt-5">Gửi lại</v-btn>
        </div>

        <overlay-custom-component :open="loading" />
      </v-sheet>
    </v-col>
  </v-row>
</template>
