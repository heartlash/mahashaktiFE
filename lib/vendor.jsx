import Backend from "@/config/backend";

export const getVendorsData = async () => {

    try {
        const response = await Backend.get("/data/vendors");

        if (response.data.status == 'SUCCESS') {
            return response.data.data;
        }
        else return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getVendorsCredits = async () => {

    try {
        const response = await Backend.get("/sale/credits");

        if (response.data.status == 'SUCCESS') {

            return { data: response.data.data, errorMessage: null }
        }
        else return {
            data: null,
            errorMessage: response.data.message
        };
    } catch (error) {
        console.log(error);
        return { data: null, errorMessage: error.response.data.errorMessage }
    }
}

export const settleVendorCredit = async (vendorId, amount) => {
    try {
        const response = await Backend.post('/sale/credits/settle', {
            params: {
                vendorId: vendorId,
                amount: amount
            }
        });

        console.log(response.data);

        if (response.data.status == 'SUCCESS') {

            return { data: response.data.data, errorMessage: null }
        }
        else return {
            data: null,
            errorMessage: response.data.message
        };
    } catch (error) {
        console.log(error);
        return { data: null, errorMessage: error.response.data.errorMessage }
    }
}