import React from 'react';
import { Edit, SimpleForm, TextInput, ReferenceInput, SelectInput } from 'react-admin';

export const OrderEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <ReferenceInput source="product_id" reference="categories">
                <SelectInput optionText="title" />
            </ReferenceInput>
            <TextInput source="status" />
        </SimpleForm>
    </Edit>
);
