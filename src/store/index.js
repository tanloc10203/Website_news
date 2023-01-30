import { createStore } from "vuex";
import auth from "./modules/auth";
import category from "./modules/category";
import toast from "./modules/toast";

export default createStore({
  modules: {
    auth,
    category,
    toast,
  },
  devtools: process.env.NODE_ENV !== "production",
});
