import Backend from "@/config/backend";

export const getVendorsData = async () => {

    try {
        const response = await Backend.get("/data/vendors");

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getVendorsCredits = async () => {

    try {
        const response = await Backend.get("/sale/credits");
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const settleVendorCredit = async (vendorId, amount) => {
    try {
        const response = await Backend.post('/sale/credits/settle', null, {
            params: {
                vendorId: vendorId,
                amount: amount
            }
        });

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}