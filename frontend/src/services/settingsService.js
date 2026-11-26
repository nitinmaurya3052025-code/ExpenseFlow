import api from "./api";

export const updateProfile = async (data) => {
  const response = await api.put("/users/me", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put("/users/me/password", data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/users/me");
  return response.data;
};
