import Backend from "@/config/backend";


export const getAllFeedQuantity = async () => {

    try {
        const response = await Backend.get("feed/quantity");

        var feedQuantityList = []
        for (var feedQuantity of response.data.data) {
            feedQuantity.shedId = feedQuantity.shed.id
            feedQuantity.shed = null
            feedQuantityList.push(feedQuantity);
        }
        return { data: feedQuantityList, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getFeedQuantityPerShed = async (shedId) => {

    try {
        const response = await Backend.get(`/feed/quantity/shed/${shedId}`);

        return { data: response.data.data, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}


export const updateFeedQuantity = async (updatedFeedQuantity) => {
    try {

        const response = await Backend.put(`/feed/quantity/${updatedFeedQuantity.id}`,
            updatedFeedQuantity,
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


export const getAllFeedComposition = async () => {

    try {
        const response = await Backend.get("feed/composition");

        var feedCompositionList = []
        for (var feedComposition of response.data.data) {
            feedComposition.shedId = feedQuantity.shed.id
            feedComposition.shed = null
            feedCompositionList.push(feedComposition);
        }
        return { data: feedCompositionList, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}


export const getFeedCompositionPerShed = async (shedId) => {

    try {
        const response = await Backend.get(`/feed/composition/shed/${shedId}`);

        return { data: response.data.data, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}


export const updateFeedComposition = async (updatedFeedComposition) => {
    try {

        const response = await Backend.put(`/feed/composition/${updatedFeedComposition.id}`,
            updatedFeedComposition,
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
