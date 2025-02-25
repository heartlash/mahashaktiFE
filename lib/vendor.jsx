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

export const saveVendor= async (vendorData) => {

    try {
        const response = await Backend.post("/data/vendors", 
            vendorData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const updateVendor = async (updatedVendorData) => {

    try {
        const response = await Backend.put(`/data/vendor/${updatedVendorData.id}`,
            updatedVendorData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const deleteVendor = async (vendorId) => {

    try {
        const response = await Backend.delete(`/data/vendor/${vendorId}`);
        return { data: response.data.data, errorMessage: null }
        
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}