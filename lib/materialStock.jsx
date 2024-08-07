import Backend from "@/config/backend";


export const getEggCount = async () => {

    try {
    const response = await Backend.get("/analytics/egg-stock");

    if(response.data.status == 'SUCCESS') 
        return response.data.data.count;
    else return null;
    } catch(error) {
        console.log(error);
        return null;
    }
}
