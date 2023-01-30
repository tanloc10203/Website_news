const state = () => ({
  text: "",
  color: "error",
  open: false,
  timeout: 1500,
  location: "top right",
});

const mutations = {
  SET_STATE: (state, payload) => {
    state.text = payload.text;
    state.color = payload.color;
    state.open = payload.open;
  },
  SET_OPEN: (state, payload) => {
    state.open = payload.open;
  },
};

const actions = {
  startToast: ({ commit }, payload) => {
    commit("SET_STATE", payload);
  },
  saveOpen: ({ commit }, payload) => {
    commit("SET_OPEN", payload);
  },
};

const getters = {
  getState: (state) => state,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
