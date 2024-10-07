import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const getSaleHomeData = async () => {

    try {
        const response = await Backend.get("/sale/latest");

        var saleCount = 0;
        var averageSaleRate = 0;
        for (var saleData of response.data.data) {
            saleCount += saleData.soldCount;
            averageSaleRate += saleData.rate;
        }
        averageSaleRate = parseFloat(averageSaleRate / response.data.data.length).toFixed(2);
        return {
            data: {
                saleCount,
                averageSaleRate,
                saleDate: getFormattedDate(response.data.data[0].saleDate)
            },
            errorMessage: null
        }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getSaleDataDateRange = async (startDate, endDate) => {
    try {
        var saleDataList = []
        const response = await Backend.get('/sale', {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });

        for (var data of response.data.data) {
            data.vendorId = data.vendor.id
            data.vendorName = data.vendor.name
            data.vendor = null

            saleDataList.push(data)
        }
        return { data: saleDataList.reverse(), errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const updateSaleData = async (updatedSaleData) => {
    try {
        const response = await Backend.put(`/sale/${updatedSaleData.id}`,
            updatedSaleData,
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

export const deleteSaleData = async (saleDataId) => {
    try {
        const response = await Backend.delete(`/sale/${saleDataId}`);
        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const saveSaleData = async (saleData) => {
    var response;
    try {
        response = await Backend.post("/sale", [saleData]);

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

export const groupSalesByDate = (sales) => {
    return sales.reduce((groups, sale) => {
        const date = new Date(sale.saleDate).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(sale);
        return groups;
    }, {});
};