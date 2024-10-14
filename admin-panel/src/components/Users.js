import { ArrayField, ChipField, Datagrid, DateField, EmailField, List, SingleFieldList, TextField } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <EmailField source="email" />
            <DateField source="joinedAt" />
            <TextField source="phone" />
        </Datagrid>
    </List>
);