// OrderList.js
import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    ShowButton,
} from 'react-admin';

import {
    Edit,
    SimpleForm,
    TextInput,
    ArrayInput,
    SimpleFormIterator,
    FileInput,
    FileField,
} from 'react-admin';


export const OrderList = (props) => {
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="userId" />
                <TextField source="userPhone" />
                <EditButton basePath="/orders" />
                <ShowButton basePath="/orders" />
            </Datagrid>
        </List>
    );
};





export const OrderEdit = (props) => {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="userId" />
                <TextInput source="userPhone" />
                <ArrayInput source="products">
                    <SimpleFormIterator>
                        <TextInput source="title" />
                        <TextInput source="quantity" />
                        <TextInput source="price" />
                        <TextInput source="productStatus" />
                        <TextInput source="scheduledDate" />
                        <FileInput source="testResults" label="Upload Test Results">
                            <FileField source="testResults" title="testResults" />
                        </FileInput>
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};



