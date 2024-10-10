import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

export const OrderList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="orderId" />
      <TextField source="status" />
      <TextField source="userId" />
      <TextField source="userPhone" />
    </Datagrid>
  </List>
);
