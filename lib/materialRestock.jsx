import Backend from "@/config/backend";

export const saveMaterialRestock = async (materialRestock) => {
    try {
        const response = await Backend.post("/material/restock", materialRestock);
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}


export const getMaterialRestock = async (materialId, startDate, endDate) => {
    try {
        var response;
        if (materialId != null) {
            response = await Backend.get(`/material/restock/${materialId}`, {
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


        var materialRestockData = []

        for (var data of response.data.data) {
            data.materialName = data.material.name;
            data.materialId = data.material.id;
            data.unitName = data.material.unit.name;
            data.unitId = data.material.unit.id;
            data.unitSymbol = data.material.unit.symbol;
            data.material = null

            materialRestockData.push(data)
        }


        return { data: materialRestockData, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const updateMaterialRestockData = async (updatedMaterialRestock) => {
    try {
        const response = await Backend.put(`/material/restock/id/${updatedMaterialRestock.id}`,
            updatedMaterialRestock,
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

export const deleteMaterialRestockData = async (materialRestockId) => {
    try {
        const response = await Backend.delete(`/material/restock/id/${materialRestockId}`);

        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};
