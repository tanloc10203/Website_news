<script setup>
import { ref } from "vue";
import authApi from "../api/authApi";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const emailRules = [(v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ"];

async function handleSubmit() {
  console.log({ email: email.value, password: password.value });

  const data = {
    email: email.value,
    password: password.value,
  };

  try {
    const response = await authApi.signIn(data);
    console.log("check response login:::", response);
  } catch (error) {
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.errors
    )
      errorMessage.value = error.response.data.errors.message;
    throw new Error(error.message);
  }
}
</script>

<template>
  <v-form @submit.prevent="handleSubmit">
    <h1 class="mb-5">Đăng nhập hệ thống</h1>

    <v-alert class="mb-5" type="error" v-if="errorMessage">{{
      errorMessage
    }}</v-alert>

    <v-text-field v-model="email" label="E-mail" :rules="emailRules" />

    <v-text-field v-model="password" type="password" label="Mật khẩu" />

    <router-link to="#"> Quên mật khẩu </router-link>

    <v-btn
      type="submit"
      :disabled="!email || !password"
      color="success"
      class="mt-5 d-block"
    >
      Đăng nhập
    </v-btn>
  </v-form>
</template>
