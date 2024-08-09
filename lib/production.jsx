import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const getProductionHomeData = async () => {

    try {
    const response = await Backend.get("/production/latest");

    if(response.data.status == 'SUCCESS') {
        
        return {
            productionDate: getFormattedDate(response.data.data.productionDate),
            productionCount: response.data.data.producedCount,
            productionPercentage: response.data.data.productionPercentage,
        }

    }
    else return null;
    } catch(error) {
        console.log(error);
        return null;
    }
}


export const getProductionDataDateRange = async (startDate, endDate) => {
    try {
        const response = await Backend.get('/production', {
            params: {
              startDate: startDate,
              endDate: endDate
            }
          });

        console.log(response.data);

        if(response.data.status == 'SUCCESS') {
            return response.data.data
        }
    } catch(error) {
        console.log(error);
        return null;
    }
}