import instance from "./axios";

const nameModel = "/auth";

const authApi = {
  signUp: async (data) => {
    return await instance.post(nameModel + "/sign-up", data);
  },
  signIn: async (data) => {
    return await instance.post(nameModel + "/sign-in", data);
  },
  getCurrentUser: async (accessToken) => {
    return await instance.get(nameModel + "/sign-in", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  },
  signOut: async () => {
    return await instance.post(nameModel + "/sign-out");
  },
  forgotPassword: async (data) => {
    return await instance.post(nameModel + "/forgot-password", data);
  },
  refreshToken: async () => {
    return await instance.get(nameModel + "/refresh-token");
  },
};

export default authApi;
