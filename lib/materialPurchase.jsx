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
        const response = await Backend.get(`/material/purchase/${materialId}`, {
            params: {
                startDate,
                endDate,
            },
        });

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