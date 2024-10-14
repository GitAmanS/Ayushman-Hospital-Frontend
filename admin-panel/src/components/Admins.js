
import { Datagrid, DateField, List, ReferenceField, TextField } from 'react-admin';
import { BooleanInput, Create, Edit, ReferenceInput, SimpleForm,SelectInput, TextInput } from 'react-admin';

export const AdminList = () => (
    <List>
        <Datagrid>
            <ReferenceField source="_id" reference="admins" />
            <TextField source="username" />
            <TextField source="password" />
            <TextField source='role'/>
            <DateField source="__v" />
            <TextField source="id" />
        </Datagrid>
    </List>
);


export const AdminEdit = () => (
    <Edit>
      <SimpleForm>
        <TextInput source="username" disabled/>
        <TextInput source="password" disabled/>
        {/* Replace TextInput with SelectInput for the role */}
        <SelectInput
          source="role"
          choices={[
            { id: 'admin', name: 'Admin' },
            { id: 'superadmin', name: 'Superadmin' }
          ]}
        />
      </SimpleForm>
    </Edit>
);


export const AdminCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="password" />
      {/* Replace TextInput with SelectInput for the role */}
      <SelectInput
        source="role"
        choices={[
          { id: 'admin', name: 'Admin' },
          { id: 'superadmin', name: 'Superadmin' }
        ]}
      />
    </SimpleForm>
  </Create>
);