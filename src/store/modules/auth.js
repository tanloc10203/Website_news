const state = () => ({
  accessToken: localStorage.getItem("accessToken") || "",
  user: {},
});

const mutations = {
  setAccessToken: (state, accessToken) => {
    state.accessToken = accessToken;
  },
  setUser: (state, user) => {
    state.user = user;
  },
};

const actions = {
  saveAccessToken: ({ commit }, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    commit("setAccessToken", accessToken);
  },

  saveUser: ({ commit }, user) => {
    commit("setUser", user);
  },

  remove: ({ commit }) => {
    localStorage.removeItem("accessToken");
    commit("setUser", {});
    commit("setAccessToken", "");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
