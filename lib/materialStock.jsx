import Backend from "@/config/backend";
import { getFormattedDate } from "./util";


export const getMaterialStock = async () => {
    try {
        var materialStockDataList = []
        console.log("comes here to material stock")
        const response = await Backend.get("/analytics/material-stock");
        console.log("after here to material stock")
        //console.log("see material stock: ", response.data);

        if (response.data.status == 'SUCCESS') {
            var index = 1
            for (var data of response.data.data) {
                data.id = index++
                data.lastPurchaseDate = getFormattedDate(data.lastPurchaseDate)
                materialStockDataList.push(data);
            }
            return { data: materialStockDataList, errorMessage: null }
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
