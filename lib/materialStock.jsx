import Backend from "@/config/backend";


export const getMaterialStock= async () => {
    try {
    var materialStockDataList = []
    console.log("comes here to material stock")
    const response = await Backend.get("/analytics/material-stock");
    console.log("after here to material stock")
    console.log("see material stock: ", response.data);

    if(response.data.status == 'SUCCESS') {
        var index  = 1
        for(var data of response.data.data) {
            data.id = index++
            materialStockDataList.push(data);
        }
        return materialStockDataList;
    }
    else return null;
    } catch(error) {
        console.log(error);
        return null;
    }
}
