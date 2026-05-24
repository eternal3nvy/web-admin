import api from "../api/axios";

export const createModerator = async (data) => {
  const res = await api.post("/auth/moderators", data);
  return res.data;
};
