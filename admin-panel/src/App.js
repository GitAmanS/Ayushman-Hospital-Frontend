import React, { useEffect, useState } from "react";
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from "react-admin";
import axios from "axios";
import { SimpleForm, TextInput, ImageInput, ImageField } from 'react-admin';
import { CategoryEdit, CategoryList,CreateCategory } from "./components/Category";
import { ProductCreate, ProductEdit, ProductList } from "./components/Product";
import { OrderEdit, OrderList } from "./components/Orders";
import { UserList } from "./components/Users";
import { dataProvider } from "./components/dataProvider";
import { AdminList , AdminEdit, AdminCreate} from "./components/Admins";
import authProvider from "./components/authProvider";
import RoleProtectedResource from "./components/RoleProtectedResource";
import { BrowserRouter, useLocation } from 'react-router-dom';


// API URL
const apiUrl = "http://localhost:5000/api/admin"; // Update with your backend URL



// Main App Component
const App = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const location = useLocation(); 
  // const { isPending, authenticated } = useAuthState();
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await authProvider.GetUserRole(); // Make sure to include credentials if needed
        console.log("fetchuserRole:", response)
        // Assuming the response has a 'role' field
        if (response === 'superadmin') {
          console.log("super admin set")
          setIsSuperUser(true);
        } else {
          console.log("admin set")
          setIsSuperUser(false);
        }

        console.log("isSuperAdmin:", isSuperUser)
      } catch (error) {
        console.error('Error fetching user role:', error);
        setIsSuperUser(false); // Handle error appropriately
      }
    };

    // if (authenticated) {
    //   fetchUserRole();
    // }

    fetchUserRole()

     // Call the async function
  }, [location]); // Empty array ensures this runs once on mount
  return (
    
          <Admin authProvider={authProvider} dataProvider={dataProvider}>
      <Resource name="categories" list={CategoryList} create={CreateCategory} edit={CategoryEdit} />
      <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} />
      <Resource name="orders"   list={OrderList} edit={OrderEdit}/>
      <Resource name="users" list={UserList} />
      {
        isSuperUser&&<Resource name="admins" list={AdminList} edit={EditGuesser} create={AdminCreate}/>
      }
      
      
      
    </Admin>
    

  );
};


export default App;
