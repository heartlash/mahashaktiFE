import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const saveMaterialConsumption = async (materialConsumption) => {
    try {
        console.log("comes here to material stock")
        const response = await Backend.post("/material/consumption", [materialConsumption]);
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