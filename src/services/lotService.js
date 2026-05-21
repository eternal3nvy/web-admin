import api from "../api/axios";

export const getAllLots = async (params = {}) => {
    const res = await api.get("/lots", { params });
    return res.data;
};

export const getCategories = async () => {
    const res = await api.get("/categories");
    return res.data;
};

export const getSubcategories = async (categoryId) => {
    const res = await api.get(`/categories/${categoryId}/subcategories`);
    return res.data;
};

export const getLotById = async (id) => {
    const res = await api.get(`/lots/${id}`);
    return res.data;
};

export const approveLot = async (id) => {
    const res = await api.post(`/lots/${id}/approve`);
    return res.data;
};

export const rejectLot = async (id, reason = '') => {
    const res = await api.post(`/lots/${id}/reject`, { reason });
    return res.data;
};