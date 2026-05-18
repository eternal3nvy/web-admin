import api from "../api/axios";

export const getMainStat = async() => {
    const res = await api.get("/stat/main");

    return res.data;
}