import Backend from "@/config/backend";


export const getProfitData = async (startDate, endDate) => {

    try {
        const response = await Backend.get("/analytics/projected-profits", {
            params: {
                startDate,
                endDate,
            },
        });

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        };
    }
}

export const getPriceRecommendation = async () => {

    try {
        const response = await Backend.get("/analytics/price-recommendation");
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        };
    }
}
