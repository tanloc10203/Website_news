import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import "./assets/css/styles.css";

createApp(App).use(store).use(router).use(vuetify).mount("#app");
