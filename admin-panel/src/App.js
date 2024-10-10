import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from './components/authProvider';
import dataProvider from './components/dataProvider';
import { ProductList, ProductEdit, ProductCreate } from './components/Product';
import { CategoryList, CategoryEdit, CategoryCreate } from './components/Category';
import { OrderList } from './components/Orders';
import AdminList from './components/Admins';

const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="products" list={ProductList} edit={ProductEdit} create={ProductCreate} />
    <Resource name="categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} />
    <Resource name="orders" list={OrderList} />
    <Resource name="admins" list={AdminList} />
  </Admin>
);

export default App;
