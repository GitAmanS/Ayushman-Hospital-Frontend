import axios from "axios";
import React, { useState } from "react";
import { dataProvider } from "./dataProvider";
import {
    List,
    Datagrid,
    ReferenceField,
    TextField,
    ArrayField,
    SingleFieldList,
    ChipField,
    Edit,
    SimpleForm,
    TextInput,
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    NumberInput,
    Button,
    useNotify,
    useRefresh,
    useRedirect,
    useGetList,
    WithRecord,
} from 'react-admin';

export const OrderList = () => {
    const { data, loading, error } = useGetList('orders');

    console.log('Orders data:', data); // Check the data here

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <List>
            <Datagrid rowClick="edit">
                <ReferenceField source="parentId" reference="orders" />
                <TextField source="id" label="Order ID" />

                <ArrayField source="products">
                    <SingleFieldList>
                        <ChipField source="title" />
                    </SingleFieldList>
                </ArrayField>
                <ReferenceField source="userId" reference="orders" label="User ID" />
                <TextField source="userPhone" label="User Phone" />
                <TextField 
                    source="totalAmount" 
                    label="Total (Rs)" 
                />
                <TextField source="address.pincode" label="Pincode" />
            </Datagrid>
        </List>
    );
};

const ProductActions = ({ productStatus, productId, orderId, userId, product }) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [scheduledDate, setScheduledDate] = useState('');
    const [showDateInput, setShowDateInput] = useState(false);
    const [file, setFile] = useState(null); // Add state for file input
    const [showUploadInput, setShowUploadInput] = useState(false);

    const handleSchedule = async () => {
        if (scheduledDate) {
            const response = await dataProvider.scheduleProduct(productId, orderId, userId, scheduledDate);
            notify(`Product ${productId} has been scheduled for ${scheduledDate}.`);
            refresh();
            setScheduledDate('');
            setShowDateInput(false);
        } else {
            notify('Please select a date to schedule the product.', 'warning');
        }
    };

    const handleProcess = async () => {
        const response = await dataProvider.processProduct(productId, orderId, userId);
        notify(`Product ${productId} is now being processed.`);
        refresh();
    };

    // New logic for handling file upload
    const handleUploadTestResult = async () => {
        if (!file) {
            notify('Please select a file to upload.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('testResult', file);
        formData.append('productId', productId);
        formData.append('orderId', orderId);
        formData.append('userId', userId)

        try {
            const response = await dataProvider.uploadTestResult(orderId, productId, formData);
            console.log("response result upload:", response)
            notify(`Test result uploaded.`);
            refresh();
        } catch (error) {
            notify(`Failed to upload test result: ${error.message}`, 'warning');
        }
    };

    const handleUpdateTestResult = () => {
        setShowUploadInput(!showUploadInput);
    };

    const handleDeleteTestResult= async()=>{
        try{
            const response = await dataProvider.deleteTestResult(orderId, productId, product.testResults[0]._id, userId);
            notify(`Test result deleted.`);
            refresh();
        }catch(err){
            console.log(err)
        }
    }

    const toggleDateInput = () => {
        setShowDateInput(!showDateInput);
    };

    // Render the file input and submit button when the product status is 'processing'
    switch (productStatus) {
        case 'pending':
            return (
                <div>
                    <Button label="Schedule Product" onClick={toggleDateInput} />
                    {showDateInput && (
                        <div>
                            <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                            />
                            <Button label="Submit" onClick={handleSchedule} />
                        </div>
                    )}
                </div>
            );
        case 'scheduled':
            return <Button label="Process Product" onClick={handleProcess} />;
        case 'processing':
            return (
                <div>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])} // Store selected file
                        accept=".pdf,.jpg,.png,.docx" // Limit acceptable file types
                    />
                    <Button label="Upload Test Result" onClick={handleUploadTestResult} />
                </div>
            );
            case 'completed':
                return (
                    <div>
                        <div className="flex gap-x-4">
                        <Button label="Update Test Result" onClick={handleUpdateTestResult} variant="contained" color="primary" />
                        <Button label="Delete Test Result" onClick={handleDeleteTestResult} variant="contained" color="error" />
                        </div>
    
    
                        {showUploadInput && (
                            <div className="mt-2">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept=".pdf,.jpg,.png,.docx"
                                />
                                <Button label="Submit Test Result" onClick={handleUploadTestResult} />
                            </div>
                        )}
                    </div>
                );
        default:
            return null;
    }
};


export const OrderEdit = () => {
    return (
        <Edit>
            <SimpleForm className="bg-stone-900 p-6">
                {/* Order ID */}
                <WithRecord label="Order" render={record => (
                    <>
                        <TextInput
                            source="id" // Use the correct source for Order ID
                            disabled
                            className="mb-4 text-gray-700"
                            label="Order ID"
                            defaultValue={record.id} // Set default value from record
                        />

                        <TextInput
                            source="userId" // Use the correct source for Order ID
                            disabled
                            className="mb-4 text-gray-700"
                            label="User ID"
                            defaultValue={record.userId} // Set default value from record
                        />

                        {/* Products Section */}
                        <ArrayInput source="products" defaultValue={record.products || []}>
                            <SimpleFormIterator>
                                {/* Each Product */}
                                {record.products && record.products.map((product, index) => (
                                    <div key={index} className="border bg-stone-600 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
                                        <div className="flex flex-wrap justify-between gap-4">
                                            {/* Product Title */}
                                            <TextInput
                                                source={`products[${index}].title`}
                                                disabled
                                                label="Product Title"
                                                className="w-full sm:w-auto flex-grow text-gray-800"
                                                defaultValue={product.title} // Set default value
                                            />

                                            {/* Product ID */}
                                            <TextInput
                                                source={`products[${index}]._id`}
                                                disabled
                                                label="Product ID"
                                                className="w-full sm:w-auto flex-grow text-gray-800"
                                                defaultValue={product._id} // Set default value
                                            />
                                        </div>

                                        <div className="flex flex-wrap justify-between gap-4 mt-4">
                                            {/* Quantity */}
                                            <NumberInput
                                                source={`products[${index}].quantity`}
                                                disabled
                                                label="Quantity"
                                                className="w-full sm:w-auto flex-grow text-gray-800"
                                                defaultValue={product.quantity} // Set default value
                                            />

                                            {/* Price */}
                                            <NumberInput
                                                source={`products[${index}].price`}
                                                disabled
                                                label="Price"
                                                className="w-full sm:w-auto flex-grow text-gray-800"
                                                defaultValue={product.price} // Set default value
                                            />
                                        </div>

                                        <div className="flex flex-wrap justify-between gap-4 mt-4">
                                            {/* Product Status */}
                                            <TextInput
                                                source={`products[${index}].productStatus`}
                                                disabled
                                                label="Status"
                                                className="w-full sm:w-auto flex-grow text-gray-800"
                                                defaultValue={product.productStatus} // Set default value
                                            />

                                            {/* Test Results */}
                                            <TextField
                                                source={`products[${index}].testResults[0].pdfLink`}
                                                disabled
                                                label="Test Results"
                                                className="w-full sm:w-auto flex-grow text-gray-800"
                                            />

                                        </div>

                                        {/* Action buttons based on product status */}
                                        <div className="mt-4">
                                            <ProductActions orderId={record.id} userId={record.userId} productStatus={product.productStatus} productId={product._id} product={product} />
                                        </div>
                                    </div>
                                ))}
                            </SimpleFormIterator>
                        </ArrayInput>

                        {/* User Phone */}
                        <TextInput
                            source="userPhone"
                            disabled
                            className="mb-4 text-gray-700"
                            label="User Phone"
                            defaultValue={record.userPhone} // Ensure user phone value is shown
                        />

                        {/* Address Pincode */}
                        <TextInput
                            source="address.pincode"
                            disabled
                            className="mb-4 text-gray-700"
                            label="Pincode"
                            defaultValue={record.address?.pincode} // Ensure pincode is shown
                        />
                    </>
                )} />
            </SimpleForm>
        </Edit>
    );
};
