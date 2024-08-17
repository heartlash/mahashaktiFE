import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const saveMaterialPurchase = async (materialPurchase) => {
    try {
        console.log("comes here to material stock")
        const response = await Backend.post("/material/purchase", [materialPurchase]);
        console.log("after here to material stock")

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


export const getMaterialPurchaseHistory = async (materialId, startDate, endDate) => {
    try {
        const response = await Backend.get(`/material/purchase/materialId/${materialId}`, {
            params: {
                startDate,
                endDate,
            },
        });

        console.log("see response: ", response.data)
        if (response.data.status == 'SUCCESS') {
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

export const updateMaterialPurchaseData = async (updatedMaterialPurchaseData) => {
    try {
        const response = await Backend.put(`/material/purchase/${updatedMaterialPurchaseData.id}`,
            updatedMaterialPurchaseData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.status == 'SUCCESS') {
            return response.data;
        } else return null;

    } catch (error) {
        console.error('Error updating item:', error);
        return null;
    }
};

export const deleteMaterialPurchaseData = async (materialPurchaseDataId) => {
    try {
        const response = await Backend.delete(`/material/purchase/${materialPurchaseDataId}`);

        if (response.data.status == 'SUCCESS') {
            return response.data;
        } else return null;

    } catch (error) {
        console.error('Error updating item:', error);
        return null;
    }
};
