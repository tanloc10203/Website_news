import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import CKEditor from "@ckeditor/ckeditor5-vue";
import "./assets/css/styles.css";

const app = createApp(App);

app.use(CKEditor);
app.use(store);
app.use(router);
app.use(vuetify);

app.mount("#app");
