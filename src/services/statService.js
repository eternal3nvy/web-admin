import api from "../api/axios";

export const getMainStat = async() => {
    const res = await api.get("/stat/main");

    return res.data;
}

export const getUsersGrowthStat = async (startDate, endDate) => {
    const res = await api.get("/stat/users-growth", {
        params: {
            startDate,
            endDate
        }
    });

    return res.data;
}

export const getLotsByCategory = async () => {
    const res = await api.get("/stat/lots-by-category");

    return res.data;
}

export const getLotsByPeriod = async (startDate, endDate) => {
    const res = await api.get("/stat/lots-by-period", {
        params: {
            startDate,
            endDate
        }
    });

    return res.data;
}