import postApi from "@/api/postApi";

const state = () => ({
  posts: [],
  isLoading: false,
  error: "",
  filters: {
    page: 1,
    limit: 5,
    where: "",
  },
  pagination: {
    page: 1,
    limit: 5,
    totalRows: 5,
  },
});

const mutations = {
  FETCH_START: (state) => {
    state.isLoading = true;
  },
  FETCH_CREATE_SUCCESS: (state) => {
    state.isLoading = false;
  },
  FETCH_FAIL: (state, payload) => {
    state.isLoading = false;
    state.error = payload;
  },
  FETCH_ALL_SUCCESS: (state, payload) => {
    state.isLoading = false;
    state.posts = payload.elements;
    state.pagination = payload.meta.pagination;
    state.filters = {
      ...state.filters,
      limit: payload.meta.pagination.limit || 5,
    };
  },
};

const actions = {
  fetchCreatePost: ({ commit, dispatch }, payload) => {
    return new Promise(async (resovle, reject) => {
      try {
        commit("FETCH_START");
        const response = await postApi.create(payload);

        if (response && response.elements) {
          const payload = {
            text: "Thêm bài viết thành công",
            color: "success",
            open: true,
            timeout: 2000,
          };
          dispatch("toast/startToast", payload, { root: true });
          commit("FETCH_CREATE_SUCCESS");
          resovle(true);
        }
      } catch (error) {
        let payload = {
          text: error.message,
          color: "error",
          open: true,
          timeout: 2000,
        };

        if (error.response) {
          payload = {
            ...payload,
            text: error.response.data.errors.message,
          };
          commit("FETCH_FAIL", error.response.data.errors.message);
        } else {
          commit("FETCH_FAIL", error.message);
        }

        dispatch("toast/startToast", payload, { root: true });

        reject(error);
      }
    });
  },
  fetchAllPost: async ({ commit, dispatch }, payload) => {
    try {
      commit("FETCH_START");

      const response = await postApi.getAll(payload);

      if (response && response.elements) {
        commit("FETCH_ALL_SUCCESS", response);
      }
    } catch (error) {
      if (!error.response) {
        const payload = {
          text: error.message,
          color: "error",
          open: true,
        };
        dispatch("toast/startToast", payload, { root: true });
        commit("FETCH_FAIL", error.message);
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
