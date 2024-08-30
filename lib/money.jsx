import Backend from "@/config/backend";


export const getProfitData = async (startDate, endDate) => {

    try {
    const response = await Backend.get("/analytics/projected-profits",  {
        params: {
            startDate,
            endDate,
        },
    });
    console.log("see here called profitData: ")
    console.log(response.data)
    if (response.data.status == 'SUCCESS') {
        return { data: response.data.data, errorMessage: null }
    } else return {
        data: null,
        errorMessage: response.data.message
    }
} catch (error) {
    console.log(error);
    return {
        data: null,
        errorMessage: error.response.data.errorMessage
    };
}
}
