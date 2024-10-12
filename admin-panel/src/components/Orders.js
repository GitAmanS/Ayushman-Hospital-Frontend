import React from 'react';
import { ArrayField, ChipField, Datagrid, List, ReferenceField, SingleFieldList, TextField } from 'react-admin';

import { ArrayInput, DateInput, Edit, NumberInput, ReferenceInput, SimpleForm, SimpleFormIterator, TextInput } from 'react-admin';

export const OrderList = () => (
    <List>
        <Datagrid >
            <TextField source="id" />
            <ArrayField source="products"><SingleFieldList><ChipField source="title" /></SingleFieldList></ArrayField>
            <ReferenceField source="userId" reference="orders" />
            <TextField source='userId'/>
            <TextField source="userPhone" />
        </Datagrid>
    </List>
);


export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <ArrayInput source="products"><SimpleFormIterator><TextInput source="title" />
            <ReferenceInput source="productId" reference="products" />
            <NumberInput source="quantity" />
            <NumberInput source="price" />
            <TextInput source="image" />
            <TextInput source="productStatus" />
            <ReferenceInput source="_id" reference="s" />
            <TextInput source="testResults" />
            <DateInput source="scheduledDate" /></SimpleFormIterator></ArrayInput>
            <ReferenceInput source="userId" reference="users" />
            <TextInput source="userPhone" />
        </SimpleForm>
    </Edit>
);
