import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const saveOperationalExpense = async (operationalExpense) => {
    try {
        const response = await Backend.post("/operational-expense", [operationalExpense]);

        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}



export const getOperationalExpenses = async (itemId, startDate, endDate) => {
    try {

        var response;
        if (itemId != null) {
            response = await Backend.get(`/operational-expense/itemId/${itemId}`, {
                params: {
                    startDate,
                    endDate,
                },
            });
        }

        else {
            response = await Backend.get("/operational-expense", {
                params: {
                    startDate,
                    endDate,
                },
            });
        }

        var operationalExpenseData = []

        for (var data of response.data.data) {
            data.itemName = data.item.item;
            data.itemId = data.item.id;
            data.item = null;
            operationalExpenseData.push(data)
        }
        return { data: operationalExpenseData, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error

        }
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

        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};

export const deleteOperationalExpenses = async (operationalExpenseId) => {
    try {
        const response = await Backend.delete(`/operational-expense/${operationalExpenseId}`);
        return { data: response.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
};


export const getOperationalExpenseItems = async () => {
    try {
        const response = await Backend.get("/data/operational-expense-items");
        return { data: response.data.data, errorMessage: null }

    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}

export const getOperationalExpensesLatest = async () => {
    try {
        const response = await Backend.get("/operational-expense/latest");
        return { data: response.data.data, errorMessage: null }
    } catch (error) {
        console.log(error);
        return {
            data: null,
            errorMessage: error.response?.data?.errorMessage || error.message || error
        }
    }
}