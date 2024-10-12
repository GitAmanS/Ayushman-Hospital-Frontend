import React from "react";
import { Admin, Resource, ListGuesser, EditGuesser, Create } from "react-admin";
import axios from "axios";
import { SimpleForm, TextInput, ImageInput, ImageField } from 'react-admin';
import { CategoryEdit, CategoryList } from "./components/Category";
import { ProductCreate, ProductEdit, ProductList } from "./components/Product";
import { OrderEdit, OrderList } from "./components/Orders";



// API URL
const apiUrl = "http://localhost:5000/api/admin"; // Update with your backend URL

const authProvider = {
  login: async ({ username, password }) => {
    const response = await axios.post(`${apiUrl}/login`, { username, password }, { withCredentials: true });
    console.log("Login response:", response);
    if (response.status === 200) {
        console.log("Login successful");
        return Promise.resolve(); // Login successful
    }
    return Promise.reject(); // Handle failure
  },
  logout: () => {
    // Typically, the logout action may not require special handling for cookies.
    return Promise.resolve();
  },
  checkAuth: async () => {
    try {
        // Make a request to the backend to verify the token
        const response = await axios.get(`${apiUrl}/check-auth`, { withCredentials: true });
        if (response.status === 200) {
            return Promise.resolve(); // User is authenticated
        }
    } catch (error) {
        console.error("Authentication check failed", error);
        return Promise.reject(); // User is not authenticated
    }
},

  checkError: (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve(),
};

// Custom data provider for the backend
const dataProvider = {
  getList: (resource, params) => {
    return axios.get(`${apiUrl}/${resource}`, { withCredentials: true }) // Send cookies with the request
      .then((response) => {
        console.log({data: response.data})
        return { data: response.data.data, total: response.data.total };
      });
  },
  getOne: (resource, params) => {
    console.log("idof a single order:", params)
    return axios.get(`${apiUrl}/${resource}/${params.id}`, { withCredentials: true }) // Send cookies with the request
      .then((response) => {
        console.log({ data: response.data.data })
        return { data: response.data.data };
      });
  },
  create: (resource, params) => {
    console.log("params:", params)

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
    return axios.post(`${apiUrl}/${resource}`, formData, { withCredentials: true }) // Send cookies with the request
      .then((response) => {
        console.log("response:", response.data)
        return { data: response.data };
      });
  },
  update: (resource, params) => {
    console.log("params:", params)

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
  getMany: (resource, params) => {
    console.log("params:", params)

    const config = {
      withCredentials: true, // Send cookies with the request
      data: { ids: params.ids } // Send the IDs in the request body
    };// Convert IDs array to a comma-separated string
    return axios.get(`${apiUrl}/${resource}`, config)
    .then((response) => {
      console.log("API Response:", response.data); // Log the full response data
      return {
        data: response.data.data.map(item => ({
          ...item,
          id: item._id // Map _id to id
        }))
      };
    });
  },

  deleteMany: (resource, params) => {
    console.log("params:", params)

    const config = {
      withCredentials: true, // Send cookies with the request
      data: { ids: params.ids } // Send the IDs in the request body
    };
    return axios.delete(`${apiUrl}/${resource}`, config)
      .then((response) => ({
        data: params.ids // Return the deleted IDs
      }));
  },

};

// Main App Component
const App = () => {
  return (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
      <Resource name="categories" list={CategoryList} create={CreateCategory} edit={CategoryEdit} />
      <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} />
      <Resource name="orders" list={OrderList} edit={OrderEdit}/>
      <Resource name="admins" list={ListGuesser} create={CreateAdmin} />
      
    </Admin>
  );
};

// Category Create Component
const CreateCategory = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <ImageInput source="image" label="Related images" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

// Category Edit Component
const EditCategory = () => (
  <EditGuesser>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <ImageInput source="image" label="Related images" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </EditGuesser>
);

// Product Create Component
const CreateProduct = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="desc" />
      <TextInput source="category" />
      <TextInput source="reports_within" />
      <TextInput source="contains_tests" />
      <TextInput source="price" />
      <ImageInput source="image" label="Related images" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

// Product Edit Component
const EditProduct = () => (
  <EditGuesser>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="desc" />
      <TextInput source="category" />
      <TextInput source="reports_within" />
      <TextInput source="contains_tests" />
      <TextInput source="price" />
      <ImageInput source="image" label="Related images" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </EditGuesser>
);

// Admin Create Component
const CreateAdmin = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="password" type="password" />
    </SimpleForm>
  </Create>
);

export default App;
