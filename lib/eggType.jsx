import Backend from "@/config/backend";

export const getEggTypes = async () => {

    try {
        const response = await Backend.get("/data/egg-types");
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}