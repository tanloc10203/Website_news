import categoryApi from "@/api/categoryApi";
import toast from "./toast";

const state = () => ({
  categories: [],
  isLoading: false,
  error: "",
});

const mutations = {
  fetchAllStart: (state) => {
    state.isLoading = true;
  },
  fetchAllSuccess: (state, data) => {
    state.isLoading = false;
    state.categories = data;
  },
  fetchAllFail: (state, error) => {
    state.isLoading = false;
    state.error = error;
  },
};

const actions = {
  fetchAllCategory: async ({ dispatch, commit }, filters) => {
    try {
      commit("fetchAllStart");

      const response = await categoryApi.getAll(filters);

      if (response && response.elements) {
        commit("fetchAllSuccess", response.elements);
      }
    } catch (error) {
      console.log("fetchAllCategory error:::");
      if (!error.response) {
        const payload = {
          text: error.message,
          color: "error",
          open: true,
        };
        dispatch("toast/startToast", payload, { root: true });
        commit("fetchAllFail", error.message);
      }
    }
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
