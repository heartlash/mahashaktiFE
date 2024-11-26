import Backend from "@/config/backend";


export const getFlockCount = async () => {

    try {
        const response = await Backend.get("flock/count");
        return { data: response.data.data.count, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getFlockShedCount = async (shedId) => {

    try {
        const response = await Backend.get(`/flock/shed/${shedId}/count`);
        console.log("see response: ", response)
        return { data: response.data.data.count, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getFlockChange = async (startDate, endDate, shedId) => {
    try {
        const response = await Backend.get("flock", {
            params: {
                startDate: startDate,
                endDate: endDate,
                shedId: shedId
            }
        });
        var flockChangeList = []
        for (var flockChange of response.data.data) {
            flockChange.shedId = flockChange.shed.id
            flockChange.shed = null
            flockChangeList.push(flockChange);
        }
        return { data: flockChangeList, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}


export const saveFlockChange = async (flock) => {
    try {
        const response = await Backend.post("/flock", flock);

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
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

        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const deleteFlockChange = async (flockChangeId) => {
    try {
        const response = await Backend.delete(`/flock/${flockChangeId}`);

        return { data: response.data, errorMessage: null }


    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};
