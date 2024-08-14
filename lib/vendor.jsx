import Backend from "@/config/backend";

export const getVendorsData = async () => {

    try {
        const response = await Backend.get("/data/vendors");

        if(response.data.status == 'SUCCESS') {
           return response.data.data;
        }
        
        else return null;
        
    } catch(error) {
        console.log(error);
        return null;
    }
}