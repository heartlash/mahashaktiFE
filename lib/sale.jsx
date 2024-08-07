import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const getSaleHomeData = async () => {

    try {
        const response = await Backend.get("/sale/latest");

        if(response.data.status == 'SUCCESS') {
            var saleCount = 0;

            for(var saleData of response.data.data) {
                saleCount+=saleData.soldCount;
            }
            return {
                saleCount,
                saleDate: getFormattedDate(response.data.data[0].saleDate)
            }
        }
        
        else return null;
        
    } catch(error) {
        console.log(error);
        return null;
    }
}
