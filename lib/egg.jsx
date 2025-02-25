import Backend from "@/config/backend";


export const getEggCount = async () => {

    try {
        const response = await Backend.get("/analytics/egg-stock");

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}
