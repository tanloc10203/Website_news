import categoryApi from "@/api/categoryApi";
import toast from "./toast";

const state = () => ({
  categories: [],
  isLoading: false,
  error: "",
  filters: {
    page: 1,
    limit: 5,
    where: "level,1",
  },
  pagination: {
    page: 1,
    limit: 5,
    totalRows: 5,
  },
});

const mutations = {
  fetchAllStart: (state) => {
    state.isLoading = true;
  },
  fetchAllSuccess: (state, payload) => {
    state.isLoading = false;
    state.categories = payload.elements;
    state.pagination = payload.meta.pagination;
  },
  fetchAllFail: (state, error) => {
    state.isLoading = false;
    state.error = error;
  },
  setFilter: (state, payload) => {
    state.filters = payload;
  },
};

const actions = {
  fetchAllCategory: async ({ dispatch, commit }, filters) => {
    try {
      commit("fetchAllStart");

      const response = await categoryApi.getAll(filters);

      if (response && response.elements) {
        commit("fetchAllSuccess", response);
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
  changeFilter: ({ commit }, payload) => {
    commit("setFilter", payload);
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
