import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

export const CategoryList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="category" />
            <TextField source="description" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);
