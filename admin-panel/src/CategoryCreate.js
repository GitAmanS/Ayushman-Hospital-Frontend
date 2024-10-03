import React from 'react';
import { Create, SimpleForm, TextInput, ImageInput, ImageField } from 'react-admin';

export const CategoryCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="category" />
            <TextInput source="description" multiline />
            <ImageInput source="image" label="Category Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
