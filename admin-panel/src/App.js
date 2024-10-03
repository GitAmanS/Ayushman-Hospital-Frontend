// src/App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import dataProvider from './dataProvider'; // Import your custom data provider
import { CategoryList } from './CategoryList';
import { CategoryEdit } from './CategoryEdit';
import { CategoryCreate } from './CategoryCreate';
import { OrderList } from './OrderList';
import { OrderEdit } from './OrderEdit';
import { OrderCreate } from './OrderCreate';


const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} />
        <Resource name="orders" list={OrderList} edit={OrderEdit} create={OrderCreate} />
    </Admin>
);

export default App;
