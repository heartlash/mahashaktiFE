import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const getProductionHomeData = async () => {

    try {
        const response = await Backend.get("/production/latest");

        if (response.data.status == 'SUCCESS') {

            return {
                productionDate: getFormattedDate(response.data.data.productionDate),
                productionCount: response.data.data.producedCount,
                productionPercentage: response.data.data.productionPercentage,
            }

        }
        else return null;
    } catch (error) {
        console.log(error);
        return null;
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

        if (response.data.status == 'SUCCESS') {
            for (var data of response.data.data) {
                data.value = data.producedCount
                data.label = data.productionDate
                data.date = getFormattedDate(data.productionDate)
                productionDataList.push(data)
            }
            return { data: productionDataList, errorMessage: null }
        } else return {
            data: null,
            errorMessage: response.data.message
        }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error
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

        if (response.data.status == 'SUCCESS') {
            return { data: response.data, errorMessage: null }
        } else return {
            data: null,
            errorMessage: response.data.message
        }

    } catch (error) {
        console.error('Error updating item:', error);
        return {
            data: null,
            errorMessage: error.response.data.errorMessage
        };
    }
};

export const deleteProductionData = async (productionDataId) => {
    try {
        const response = await Backend.delete(`/production/${productionDataId}`);

        if (response.data.status == 'SUCCESS') {
            return { data: response.data, errorMessage: null }
        } else return {
            data: null,
            errorMessage: response.data.message
        }

    } catch (error) {
        console.error('Error updating item:', error);
        return {
            data: null,
            errorMessage: error.response.data.errorMessage
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

        console.log("see response: ", response)
        if (response.data.status == 'SUCCESS') {
            return {
                data: response.data,
                errorMessage: null
            }
        } else return {
            data: null,
            errorMessage: response.data.message
        };

    } catch (error) {
        console.error('Error updating item:', error);
        console.error('see response', response);
        return {
            data: null,
            errorMessage: error.response.data.errorMessage
        };
    }
};