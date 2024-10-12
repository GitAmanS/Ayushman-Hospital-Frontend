import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './Context/UserContext';

const AddressBook = () => {
    const {addresses, setAddresses} = useContext(UserContext)
    const [newAddress, setNewAddress] = useState({
        pincode: '',
        addressDetails: '',
        patientName: '',
        phoneNumber: ''
    });
    const [editingAddress, setEditingAddress] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // Modal state
    const [deleteConfirm, setDeleteConfirm] = useState(null); // State for delete confirmation
    const [error, setError] = useState('');

    // useEffect(() => {
    //     const fetchAddresses = async () => {
    //         try {
    //             const response = await axios.get('/api/address');
    //             await setAddresses(response.data.addresses || []);
    //             console.log(response.data.addresses)
    //         } catch (err) {
    //             console.error('Error fetching addresses:', err);
    //             setError('Failed to fetch addresses');
    //         }
    //     };
    //     fetchAddresses();
    // }, []);

    const addNewAddress = async () => {
        try {
            const response = await axios.post('/api/address/add', newAddress);
            setAddresses([...addresses, response.data.address]);
            setNewAddress({ pincode: '', addressDetails: '', patientName: '', phoneNumber: '' });
            setModalOpen(false); // Close the modal after adding
        } catch (err) {
            console.error('Error adding address:', err);
            setError('Failed to add address');
        }
    };

    const updateAddress = async (id) => {
        try {
            const response = await axios.put(`/api/address/edit/${id}`, editingAddress);
            setAddresses(addresses.map(addr => addr._id === id ? response.data.address : addr));
            setEditingAddress(null);
            setModalOpen(false); // Close the modal after editing
        } catch (err) {
            console.error('Error updating address:', err);
            setError('Failed to update address');
        }
    };

    const deleteAddress = async (id) => {
        try {
            await axios.delete(`/api/address/delete/${id}`);
            setAddresses(addresses.filter(addr => addr._id !== id));
            setDeleteConfirm(null); // Close confirmation after delete
        } catch (err) {
            console.error('Error deleting address:', err);
            setError('Failed to delete address');
        }
    };

    const handleFormChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditingAddress({ ...editingAddress, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-6 py-24 md:px-36">
            
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Add Address Button */}
            <button
                onClick={() => setModalOpen(true)} // Open the modal
                className=" font-semibold text-xl text-blue-500 w-full py-2 rounded mb-6"
            >
                + Add a new address
            </button>

            {/* List of Addresses */}
            <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
            {addresses.length > 0 ? (
                <ul className="space-y-4">
                    {addresses.map((address) => (
                        <li key={address._id} className="bg-gray-100 rounded-lg border p-4">
                            <div>
                                <h1 className='text-xl'> {address.patientName}</h1>
                                <p>{address.addressDetails} - {address.pincode}</p>
                    
                                
                                <p>{address.phoneNumber}</p>

                                <div className="mt-4">
                                    <button
                                        onClick={() => { setEditingAddress(address); setModalOpen(true); }} // Open edit modal
                                        className="border border-black rounded-lg text-black px-4 py-2 rounded-lg mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(address._id)} // Set the confirmation state
                                        className="border rounded-lg border-black text-black px-4 py-2 rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No addresses available. Add some new addresses.</p>
            )}

            {/* Modal for Adding and Editing */}
            {modalOpen && (
                <div className="fixed inset-0 px-2 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded">
                        <h2 className="text-xl font-bold mb-4">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="patientName"
                                value={editingAddress ? editingAddress.patientName : newAddress.patientName}
                                onChange={editingAddress ? handleEditChange : handleFormChange}
                                placeholder="Patient Name"
                                className="border col-span-2 p-2 w-full"
                            />

                            <textarea
                                type="text"
                                name="addressDetails"
                                value={editingAddress ? editingAddress.addressDetails : newAddress.addressDetails}
                                onChange={editingAddress ? handleEditChange : handleFormChange}
                                placeholder="Address Details"
                                className="border row-span-2 col-span-2 p-2 w-full"
                            />
                            <input
                                type="text"
                                name="pincode"
                                value={editingAddress ? editingAddress.pincode : newAddress.pincode}
                                onChange={editingAddress ? handleEditChange : handleFormChange}
                                placeholder="Pincode"
                                className="border p-2 w-full"
                            />

                            <input
                                type="text"
                                name="phoneNumber"
                                value={editingAddress ? editingAddress.phoneNumber : newAddress.phoneNumber}
                                onChange={editingAddress ? handleEditChange : handleFormChange}
                                placeholder="Phone Number"
                                className="border p-2 w-full"
                            />
                        </div>
                        <button
                            onClick={editingAddress ? () => updateAddress(editingAddress._id) : addNewAddress}
                            className="border border-black text-black px-4 py-2 rounded  mr-2"
                        >
                            {editingAddress ? 'Update' : 'Add'}
                        </button>
                        <button
                            onClick={() => { setModalOpen(false); setEditingAddress(null); }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-gray-800 z-50 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this address?</p>
                        <div className="mt-4">
                            <button
                                onClick={() => deleteAddress(deleteConfirm)}
                                className="border border-black text-black px-4 py-2 rounded  mr-2"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressBook;
