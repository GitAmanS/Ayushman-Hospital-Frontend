import axios from 'axios';
import { stringify } from 'query-string';

const apiUrl = "/api/admin"; // Adjust the base URL as needed

export const dataProvider = {
    getList: (resource, params) => {
      // console.log("urlGetList",apiUrl,"/",resource)
      return axios.get(`${apiUrl}/${resource}`, { withCredentials: true }) // Send cookies with the request
        .then((response) => {
          console.log({dataGetList:response.data})
          return { data: response.data.data, total: response.data.total };
        });
    },
    getOne: (resource, params) => {
      console.log("params:", params);  // Logging the params
  
      return axios.get(`${apiUrl}/${resource}/${params.id}`, { withCredentials: true })
          .then(response => {
              console.log("getOne response:", response.data.data);
              return { data: response.data.data };  // Return the response in the correct format
          })
          .catch(error => {
              console.error("Error fetching data:", error);
              throw error;  // Handle the error
          });
    },
    create: (resource, params) => {
        console.log("params:", params.data)
        if(resource=="admins"){
            return axios.post(`${apiUrl}/${resource}`, {params}, { withCredentials: true }) // Send cookies with the request
            .then((response) => {
              console.log("response:", response.data)
              return { data: response.data };
            });  
        }
      const formData = new FormData();
  
      // Add other fields to formData
      for (const key in params.data) {
          if (key !== 'image') { // Skip the 'image' field for now
              formData.append(key, params.data[key]);
          }
      }
  
      // If there's an image, append it to formData
      if (params.data.image && params.data.image.rawFile) {
          formData.append('image', params.data.image.rawFile);
      }

      console.log("create:", params)
      return axios.post(`${apiUrl}/${resource}`, formData, { withCredentials: true }) // Send cookies with the request
        .then((response) => {
          console.log("response:", response.data)
          return { data: response.data };
        });
    },
    update: (resource, params) => {
      
  
      const formData = new FormData();
  
      // Add other fields to formData
      for (const key in params.data) {
          if (key !== 'image') { // Skip the 'image' field for now
              formData.append(key, params.data[key]);
          }
      }
  
      // If there's an image, append it to formData
      if (params.data.image && params.data.image.rawFile) {
          formData.append('image', params.data.image.rawFile);
      }
      return axios.put(`${apiUrl}/${resource}/${params.id}`, formData, { withCredentials: true }) // Send cookies with the request
        .then((response) => {
          console.log({data: response.data})
          return { data: response.data };
        });
    },
  
    delete: (resource, params) => {
      return axios.delete(`${apiUrl}/${resource}/${params.id}`, { withCredentials: true }) // Send cookies with the request
        .then((response) => {
          return { data: response.data };
        });
    },
    // Add getMany method
    getMany: async (resource, params) => {
      const config = {
        withCredentials: true, // Send cookies with the request
        data: { ids: params.ids } // Send the IDs in the request body
      };// Convert IDs array to a comma-separated string
      console.log("url",apiUrl,"/",resource)
  
      return await axios.get(`${apiUrl}/${resource}`, { withCredentials: true })
      .then((response) => {
        if (response && response.data && Array.isArray(response.data.data)) {
          // Proceed only if we have valid response data
          console.log("API Response:", response.data);
  
          return {
            data: response.data.data.map(item => ({
              ...item,
              id: item._id // Map _id to id
            }))
          };
        } else {
          console.log("responsegetmany:",response)
          if(!response){
            console.log("no data recieved")
          }
          
          return { data: [] }; // Return an empty array if no valid response
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        throw error; // Handle errors appropriately
      });
    },
  
    deleteMany: (resource, params) => {
  
  
      const config = {
        withCredentials: true, // Send cookies with the request
        data: { ids: params.ids } // Send the IDs in the request body
      };
      return axios.delete(`${apiUrl}/${resource}`, config)
        .then((response) => ({
          data: params.ids // Return the deleted IDs
        }));
    },
  
    scheduleProduct: async(productId, orderId, userId, scheduledDate)=>{
      
      const config = {
        withCredentials: true, // Send cookies with the request
        data: { userId: userId, scheduledDate:scheduledDate } // Send the IDs in the request body
      };
      return axios.post(`${apiUrl}/orders/${orderId}/product/${productId}/schedule`, config)
      .then((response)=>{
        return response;
        console.log("scheduleProductRes:", response)
      })
    },

    processProduct: async(productId, orderId, userId)=>{
      
        const config = {
          withCredentials: true, // Send cookies with the request
          data: { userId: userId } // Send the IDs in the request body
        };
        return axios.put(`${apiUrl}/orders/${orderId}/product/${productId}/process`, config)
        .then((response)=>{
          return response;
          console.log("processProducts:", response)
        })
      },

    
      // Custom methods for uploading test results and updating product status
      uploadTestResult: async (orderId, productOrderId, formData) => {
        console.log("this is uploadTestResults")
        // const formData = new FormData();
        // formData.append('testResult', testResult);
        const { data } = await axios.post(`${apiUrl}/orders/${orderId}/product/${productOrderId}/test-result`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return { data };
    },
  
  };