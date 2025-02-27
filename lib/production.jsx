import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const getProductionHomeData = async () => {

    try {
        const response = await Backend.get("/production/latest");

        var totalProductionCount = 0;
        var totalProductionPercentage = 0;

        for (var production of response.data.data) {
            totalProductionCount += production.producedCount;
            totalProductionPercentage += production.productionPercentage
        }
        return {
            data: {
                productionDate: getFormattedDate(response.data.data[0].productionDate),
                productionCount: totalProductionCount,
                productionPercentage: (totalProductionPercentage / response.data.data.length).toFixed(2)
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


export const getProductionDataDateRange = async (startDate, endDate) => {
    try {
        var productionDataList = []
        const response = await Backend.get('/production', {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });

        for (var data of response.data.data) {
            data.value = data.producedCount
            data.label = data.productionDate
            data.date = getFormattedDate(data.productionDate)
            productionDataList.push(data)
        }
        return { data: productionDataList, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getProductionDataDateAndShedIdRange = async (startDate, endDate, shedId) => {
    try {
        var productionDataList = []
        const response = await Backend.get(`/production/shed/${shedId}`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });

        for (var data of response.data.data) {
            data.value = data.producedCount
            data.label = data.productionDate
            data.date = getFormattedDate(data.productionDate)
            productionDataList.push(data)
        }
        return { data: productionDataList, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const updateProductionData = async (updatedProductionData) => {
    try {
        const response = await Backend.put(`/production/${updatedProductionData.id}`,
            updatedProductionData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return { data: response.data, errorMessage: null }

    } catch (error) {
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        };
    }
};

export const deleteProductionData = async (productionDataId) => {
    try {
        const response = await Backend.delete(`/production/${productionDataId}`);

        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.error('Error updating item:', error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        };
    }
};

export const saveProductionData = async (productionData) => {
    var response;
    try {
        response = await Backend.post("/production",
            productionData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });


        return {
            data: response.data,
            errorMessage: null
        }

    } catch (error) {

        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        };
    }
};