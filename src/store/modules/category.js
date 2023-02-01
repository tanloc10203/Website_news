import categoryApi from "@/api/categoryApi";
import toast from "./toast";

const state = () => ({
  categories: [],
  categorySub: [],
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
  fetchAllSubSuccess: (state, payload) => {
    state.isLoading = false;
    state.categorySub = payload.elements;
  },
  fetchAllFail: (state, error) => {
    state.isLoading = false;
    state.error = error;
  },
  setFilter: (state, payload) => {
    state.filters = payload;
  },
  setSubCategory: (state, payload) => {
    state.categorySub = payload;
  },
};

const actions = {
  fetchAllCategory: async ({ dispatch, commit }, filters) => {
    try {
      commit("fetchAllStart");

      const response = await categoryApi.getAll(filters);

      if (response && response.elements) {
        if (!filters?.where || (filters.where && filters.where === "level,1")) {
          commit("fetchAllSuccess", response);
        } else {
          commit("fetchAllSubSuccess", response);
        }
      }
    } catch (error) {
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
  changeSubCategory: ({ commit }, payload) => {
    commit("setSubCategory", payload);
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
