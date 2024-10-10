import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const AdminList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="username" />
    </Datagrid>
  </List>
);

export default AdminList;
