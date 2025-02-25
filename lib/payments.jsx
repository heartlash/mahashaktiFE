import Backend from "@/config/backend";


export const getPaymentsDateRange = async (vendorId, startDate, endDate) => {
    try {
        var paymentsDataList = []
        var response;

        if (vendorId != null) {
            response = await Backend.get(`/payments/vendor/${vendorId}`, {
                params: {
                    startDate,
                    endDate,
                },
            });
        }

        else {
            response = await Backend.get('/payments', {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });
        }

        for (var data of response.data.data) {
            data.vendorId = data.vendor.id
            data.vendorName = data.vendor.name
            data.vendor = null
            data.sale = null

            paymentsDataList.push(data)
        }
        return { data: paymentsDataList, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const updatePayments = async (updatedPayment) => {
    try {
        const response = await Backend.put(`/payments/${updatedPayment.id}`,
            updatedPayment,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const deletePayment = async (paymentId) => {
    try {
        const response = await Backend.delete(`/payments/${paymentId}`);
        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const savePayment = async (paymentData) => {
    var response;
    try {
        response = await Backend.post("/payments", paymentData);

        return {
            data: response.data,
            errorMessage: null
        }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const getPaymentsLatest = async () => {
    try {
        const response = await Backend.get("/payments/latest");
        return { data: response.data.data, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

