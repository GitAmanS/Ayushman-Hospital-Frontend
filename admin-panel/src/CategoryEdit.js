import React from 'react';
import { Edit, SimpleForm, TextInput, ImageInput, ImageField } from 'react-admin';

export const CategoryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="category" />
            <TextInput source="description" multiline />
            <ImageInput source="image" label="Category Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);
