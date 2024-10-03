import React from 'react';
import { List, Datagrid, TextField, ReferenceField, EditButton, DeleteButton } from 'react-admin';

export const OrderList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="product_id" reference="categories">
                <TextField source="title" />
            </ReferenceField>
            <TextField source="status" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);
