import Backend from "@/config/backend";
import { getFormattedDate } from "./util";


export const getMaterialStock = async () => {
    try {
        var materialStockDataList = []
        const response = await Backend.get("/analytics/material-stock");

        var index = 1
        for (var data of response.data.data) {
            data.id = index++
            data.lastPurchaseDate = getFormattedDate(data.lastPurchaseDate)
            materialStockDataList.push(data);
        }
        return { data: materialStockDataList, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}
