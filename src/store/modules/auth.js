const state = {
  accessToken: localStorage.setItem("accessToken") || "",
};

const mutations = {
  saveAccessToken: ({ commit }, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    commit();
  },
};
const actions = {
  setAccessToken: ({ state }, accessToken) => {
    state.accessToken = accessToken;
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
