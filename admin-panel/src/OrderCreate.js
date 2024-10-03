import React from 'react';
import { Create, SimpleForm, ReferenceInput, SelectInput, TextInput } from 'react-admin';

export const OrderCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="product_id" reference="categories">
                <SelectInput optionText="title" />
            </ReferenceInput>
            <TextInput source="status" />
        </SimpleForm>
    </Create>
);
