import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const getProductionHomeData = async () => {

    try {
        const response = await Backend.get("/production/latest");


        return {
            data: {
                productionDate: getFormattedDate(response.data.data.productionDate),
                productionCount: response.data.data.producedCount,
                productionPercentage: response.data.data.productionPercentage
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