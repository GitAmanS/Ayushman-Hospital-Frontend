
import { Datagrid,Create, ImageInput,FileInput,ImageField,useNotify, DateField,useGetList, List,ReferenceField , TextField, Edit, SimpleForm, TextInput, DateInput, FileField } from 'react-admin';

import { useRefresh } from 'react-admin';


export const CreateCategory = () => (
    <Create>
      <SimpleForm>
        <TextInput source="name" />
        <TextInput source="description" />
        <ImageInput source="image" label="Related images" accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );

export const CategoryList = () => {
    const { data, loading, error } = useGetList('categories');

    console.log('Categories data:', data); // Check the data here

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <List>
            <Datagrid rowClick="edit">
                <ReferenceField source="parentId" reference="categories" />
                <TextField source="name" />
                <TextField source="description" />
                <ImageField source="image" />
                <DateField source="__v" />
            </Datagrid>
        </List>
    );
};




export const CategoryEdit = (props) => {
  console.log(props); // Check what props are received
  return (
      <Edit {...props}>
          <SimpleForm>
              <TextInput disabled source="id" />
              <TextInput source="name" />
              <TextInput source="description" />
              <FileInput source="image" label="Upload Image" accept="image/*" >
                  <FileField source="src" title="title" />
              </FileInput>
              <DateInput source="__v" />
          </SimpleForm>
      </Edit>
  );
};

