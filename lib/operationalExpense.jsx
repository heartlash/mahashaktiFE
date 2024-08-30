import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const saveOperationalExpense = async (operationalExpense) => {
    try {
        const response = await Backend.post("/operational-expense", [operationalExpense]);
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



export const getOperationalExpenses = async (startDate, endDate) => {
    try {
        const response = await Backend.get("/operational-expense", {
            params: {
                startDate,
                endDate,
            },
        });

        console.log("see response: ", response.data)
        if (response.data.status == 'SUCCESS') {
            var operationalExpenseData = []

            for (var data of response.data.data) {
                data.itemName = data.item.item;
                data.itemId = data.item.id;
                data.item = null;
                operationalExpenseData.push(data)
            }
            return { data: operationalExpenseData, errorMessage: null }
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

export const updateOperationalExpenses = async (updatedOperationalExpense) => {
    try {
        const response = await Backend.put(`/operational-expense/${updatedOperationalExpense.id}`,
            updatedOperationalExpense,
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

export const deleteOperationalExpenses = async (operationalExpenseId) => {
    try {
        const response = await Backend.delete(`/operational-expense/${operationalExpenseId}`);
        if (response.data.status == 'SUCCESS') {
            return response.data;
        } else return null;

    } catch (error) {
        console.error('Error updating item:', error);
        return null;
    }
};


export const getOperationalExpenseItems = async () => {
    try {
        const response = await Backend.get("/data/operational-expense-items");

        console.log("see response: ", response.data)
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
