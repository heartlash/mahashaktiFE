import Backend from "@/config/backend";


export const getFlockCount = async () => {

    try {
    const response = await Backend.get("flock/count");
    

    if(response.data.status == 'SUCCESS') 
        return response.data.data.count;
    else return null;
    } catch(error) {
        console.log(error);
        return null;
    }
}
