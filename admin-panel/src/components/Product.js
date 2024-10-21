import {DateInput,Create,WithRecord, useRecordContext,SelectInput,FileField,FileInput, ImageField,  Edit, NumberInput, ReferenceInput, SimpleForm, TextInput, Datagrid,useGetList, DateField, List, NumberField, ReferenceField, TextField } from 'react-admin';

export const ProductList = () => {
  const { data, loading, error } = useGetList('products');

  console.log('Products data:', data); // Check the data here

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
    return (<List>
        <Datagrid rowClick="edit">
            <ReferenceField source="parentId" reference="products" />
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="desc" />
            <TextField source="categoryName" />
            <ImageField source="image" />
            <TextField source="reports_within" />
            <NumberField source="contains_tests" />
            <NumberField source="price" />
            <DateField source="__v" />
            
        </Datagrid>
    </List>);
};


export const ProductEdit = () => {
  const record = useRecordContext();
  console.log("record:", record)
  return (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="title" />
            <TextInput source="desc" />
            {/* <TextInput source="categoryName" /> */}
            <ReferenceInput source="categories" reference="categories" defaultValue="category">
              <SelectInput optionText="name" />
            </ReferenceInput>

            <FileInput source="image" label="Upload Image" accept="image/*" >
                  <FileField source="src" title="title" />
            </FileInput>
            <TextInput source="reports_within" />
            <NumberInput source="contains_tests" />
            <NumberInput source="price" />
            <DateInput source="__v" />
            <TextInput source="id" />
        </SimpleForm>
    </Edit>
)};



export const ProductCreate = () => {
  const record = useRecordContext();
  return (
  <Create>
    <SimpleForm>
    <TextInput source="title" />
    <TextInput source="desc" />
    {/* <TextInput source="categoryName" /> */}
    <ReferenceInput source="categories" reference="categories" defaultValue={record ? record.category : undefined}>
      <SelectInput optionText="name" value="id" /> 
    </ReferenceInput>            
    <FileInput source="image" label="Upload Image" accept="image/*" >
        <FileField source="src" title="title" />
    </FileInput>
    <TextInput source="reports_within" />
    <NumberInput source="contains_tests" />
    <NumberInput source="price" />


    </SimpleForm>
  </Create>
)};