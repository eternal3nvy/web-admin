import api from "../api/axios";

export const loginWithCredentials = async(email, password) => {
    const res = await api.post("/auth/login", {
        email,
        password,
    });

    return res.data;
}