import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const saveMaterialPurchase = async (materialPurchase) => {
    try {
        const response = await Backend.post("/material/purchase", [materialPurchase]);
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}


export const getMaterialPurchase = async (materialId, startDate, endDate) => {
    try {
        var response;
        if (materialId != null) {
            response = await Backend.get(`/material/purchase/materialId/${materialId}`, {
                params: {
                    startDate,
                    endDate,
                },
            });
        }

        else {
            response = await Backend.get("/material/purchase", {
                params: {
                    startDate,
                    endDate,
                },
            });
        }


        var materialPurchaseData = []

        for (var data of response.data.data) {
            data.materialName = data.material.name;
            data.materialId = data.material.id;
            data.unitName = data.material.unit.name;
            data.unitId = data.material.unit.id;
            data.unitSymbol = data.material.unit.symbol;
            data.material = null

            materialPurchaseData.push(data)
        }


        return { data: materialPurchaseData, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
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

        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const deleteMaterialPurchaseData = async (materialPurchaseDataId) => {
    try {
        const response = await Backend.delete(`/material/purchase/${materialPurchaseDataId}`);

        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const getMaterials = async () => {
    try {
        const response = await Backend.get("/data/materials");
        var materials = []

        for(var material of response.data.data) {
            material.unit = material.unit.symbol
            materials.push(material);
        }
        return { data: materials, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getMaterialPurchaseLatest = async () => {
    try {
        const response = await Backend.get("/material/purchase/latest");
        return { data: response.data.data, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}
