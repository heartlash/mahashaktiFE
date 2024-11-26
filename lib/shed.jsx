import Backend from "@/config/backend";

export const getSheds = async () => {

    try {
        const response = await Backend.get("/data/sheds");
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}