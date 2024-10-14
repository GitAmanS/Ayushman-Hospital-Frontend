import React from 'react';
import { Resource } from 'react-admin';
import authProvider from './authProvider';

const RoleProtectedResource = ({ name, list, create, edit }) => {
    const userRole = authProvider.GetUserRole(); // Implement this based on your auth logic

    // If the user is not a superadmin, return null (render nothing)
    if (userRole !== 'superadmin') {
        console.log("user is not super admin")
        return null; // Do not render anything
    }

    // Render the Resource only if the user is a superadmin
    return <Resource name={name} list={list} create={create} edit={edit} />;
};

export default RoleProtectedResource;
