import api from "../api/axios";

export const getAllUsers = async (params = {}) => {
  const res = await api.get("/users", { params });
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const updateUserStatus = async (id, status) => {
  const res = await api.patch(`/users/${id}/status`, { status });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const getAllModerators = async (params = {}) => {
  const res = await api.get("/moderators", { params });
  return res.data;
};

export const updateModerator = async (id, data) => {
  const res = await api.patch(`/moderators/${id}`, data);
  return res.data;
};

export const updateModeratorRole = async (id, is_admin) => {
  const res = await api.patch(`/moderators/${id}/role`, { is_admin });
  return res.data;
};

export const deleteModerator = async (id) => {
  const res = await api.delete(`/moderators/${id}`);
  return res.data;
};
