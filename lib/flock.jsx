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

export const getFlockChange = async () => {
    try {
        const response = await Backend.get("/flock");
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


export const saveFlockChange = async (flock) => {
    try {
        console.log("comes here to material stock")
        const response = await Backend.post("/flock", flock);
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


export const updateFlockChange = async (updatedFlock) => {
    try {
      
        const response = await Backend.put(`/flock/${updatedFlock.id}`,
            updatedFlock,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.status == 'SUCCESS') {
            return response.data;
        } else return null;

    } catch (error) {
        console.error('Error updating item:', error);
        return null;
    }
};

export const deleteFlockChange = async (flockChangeId) => {
    try {
        const response = await Backend.delete(`/flock/${flockChangeId}`);

        if (response.data.status == 'SUCCESS') {
            return response.data;
        } else return null;

    } catch (error) {
        console.error('Error updating item:', error);
        return null;
    }
};
