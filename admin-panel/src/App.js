import React, { useEffect, useState } from "react";
import { Admin, Resource, ListGuesser,AppBar, Layout, EditGuesser, ShowGuesser,TopToolbar,Button } from "react-admin";
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
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';


// API URL
const apiUrl = "http://localhost:5000/api/admin"; // Update with your backend URL



// Custom AppBar with aligned Back Button
const CustomAppBar = (props) => {
  const navigate = useNavigate();

  return (
    <AppBar {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Button onClick={() => navigate(-1)} label="Back" color="inherit" />
        <Typography variant="h6" color="inherit" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {props.title}
        </Typography>
        <Box>{props.children}</Box>
      </Box>
    </AppBar>
  );
};

// Custom Layout including the custom AppBar
const CustomLayout = (props) => <Layout {...props} appBar={CustomAppBar} />;


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
    
      <Admin authProvider={authProvider} dataProvider={dataProvider} layout={CustomLayout}>
        <TopToolbar>
          <Button  label="Back" />
        </TopToolbar>
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
