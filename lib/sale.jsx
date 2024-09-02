import Backend from "@/config/backend";
import { getFormattedDate } from "./util";

export const getSaleHomeData = async () => {

    try {
        const response = await Backend.get("/sale/latest");

        if(response.data.status == 'SUCCESS') {
            var saleCount = 0;
            var averageSaleRate = 0;
            for(var saleData of response.data.data) {
                saleCount+=saleData.soldCount;
                averageSaleRate+=saleData.rate;
            }
            averageSaleRate=parseFloat(averageSaleRate/response.data.data.length).toFixed(2);
            return {
                saleCount,
                averageSaleRate,
                saleDate: getFormattedDate(response.data.data[0].saleDate)
            }
        }
        
        else return null;
        
    } catch(error) {
        console.log(error);
        return null;
    }
}

export const getSaleDataDateRange = async (startDate, endDate) => {
    try {
        var saleDataList = []
        const response = await Backend.get('/sale', {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });

        console.log(response.data);

        if (response.data.status == 'SUCCESS') {
            for (var data of response.data.data) {
                data.vendorId = data.vendor.id
                data.vendorName = data.vendor.name
                data.vendor = null
                if(data.paid == true) data.paid = 'Yes'
                if(data.paid == false) data.paid = 'No'

                saleDataList.push(data)
            }
            return saleDataList.reverse()
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const updateSaleData = async (updatedSaleData) => {
    try {
        const response = await Backend.put(`/sale/${updatedSaleData.id}`,
            updatedSaleData,
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

export const deleteSaleData = async (saleDataId) => {
    try {
        const response = await Backend.delete(`/sale/${saleDataId}`);

        if (response.data.status == 'SUCCESS') {
            return response.data;
        } else return null;

    } catch (error) {
        console.error('Error updating item:', error);
        return null;
    }
};

export const saveSaleData = async (saleData) => {
    var response;
    try {
        console.log("see data is the backend call: ", saleData)
        response = await Backend.post("/sale",
            [saleData]);

        console.log("see response: ", response)
        if (response.data.status == 'SUCCESS') {
            return {
                data: response.data,
                errorMessage: null
            }
        } else return {
            data: null,
            errorMessage: response.data.message
        };

    } catch (error) {
        console.error('Error updating item:', error);
        console.error('see response', response);
        return {
            data: null,
            errorMessage: error.response.data.errorMessage
        };
    }
};

export const groupSalesByDate = (sales) => {
    return sales.reduce((groups, sale) => {
      const date = new Date(sale.saleDate).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(sale);
      return groups;
    }, {});
  };