import axios from 'axios';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost:5000/api/admin'; // Adjust the base URL as needed

const dataProvider = {
    getList: async (resource, params) => {
        try {
            // Build the query parameters
            const query = {
                sort: JSON.stringify(params.sort),
                range: JSON.stringify([params.pagination.page, params.pagination.perPage]),
                filter: JSON.stringify(params.filter),
            };
            const url = `${apiUrl}/${resource}?${stringify(query)}`;
            const response = await axios.get(url);

            // Check if response data is an array and contains objects with an 'id'
            const dataWithId = response.data.map(item => ({
                ...item,
                id: item._id || item.id, // Adjust according to your response structure
            }));

            const total = response.headers['content-range'] 
                ? parseInt(response.headers['content-range'].split('/').pop(), 10) 
                : dataWithId.length;

            return {
                data: dataWithId,
                total,
            };
        } catch (error) {
            console.error('Error in getList:', error);
            throw new Error(`Error fetching the list: ${error.message}`);
        }
    },

    getOne: async (resource, params) => {
        try {
            const response = await axios.get(`${apiUrl}/${resource}/${params.id}`);
            return { data: { ...response.data, id: response.data._id || response.data.id } };
        } catch (error) {
            console.error('Error in getOne:', error);
            throw new Error(`Error fetching one record: ${error.message}`);
        }
    },

    create: async (resource, params) => {
        try {
            const response = await axios.post(`${apiUrl}/${resource}`, params.data);
            return { data: { ...params.data, id: response.data._id || response.data.id } };
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error(`Error creating resource: ${error.message}`);
        }
    },

    update: async (resource, params) => {
        try {
            const response = await axios.put(`${apiUrl}/${resource}/${params.id}`, params.data);
            return { data: { ...response.data, id: response.data._id || response.data.id } };
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error(`Error updating resource: ${error.message}`);
        }
    },

    delete: async (resource, params) => {
        try {
            await axios.delete(`${apiUrl}/${resource}/${params.id}`);
            return { data: { id: params.id } }; // Return the deleted item's id
        } catch (error) {
            console.error('Error in delete:', error);
            throw new Error(`Error deleting resource: ${error.message}`);
        }
    },
};

export default dataProvider;
