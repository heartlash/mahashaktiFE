import Backend from "@/config/backend";

export const saveMaterialConsumption = async (materialConsumption) => {
    try {
        const response = await Backend.post("/material/consumption", [materialConsumption]);

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}



export const getMaterialConsumptionHistory = async (materialId, startDate, endDate) => {
    try {
        const response = await Backend.get(`/material/consumption/materialId/${materialId}`, {
            params: {
                startDate,
                endDate,
            },
        });

        var materialPurchaseHistoryData = []

        for (var data of response.data.data) {
            data.materialName = data.material.name;
            data.materialId = data.material.id;
            data.unitName = data.material.unit.name;
            data.unitId = data.material.unit.id;
            data.unitSymbol = data.material.unit.symbol;
            data.material = null

            materialPurchaseHistoryData.push(data)
        }


        return { data: materialPurchaseHistoryData, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const updateMaterialConsumptionData = async (updatedMaterialConsumptionData) => {
    try {
        const response = await Backend.put(`/material/consumption/${updatedMaterialConsumptionData.id}`,
            updatedMaterialConsumptionData,
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

export const deleteMaterialConsumptionData = async (materialConsumptionDataId) => {
    try {
        const response = await Backend.delete(`/material/consumption/${materialConsumptionDataId}`);

        return { data: response.data, errorMessage: null }


    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};
