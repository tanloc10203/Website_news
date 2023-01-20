import { createStore } from "vuex";
import auth from "./modules/auth";

export default createStore({
  modules: {
    auth,
  },
  devtools: process.env.NODE_ENV !== "production",
});
