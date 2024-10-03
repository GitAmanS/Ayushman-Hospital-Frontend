// src/dataProvider.js
import { fetchUtils } from 'react-admin';

// Dummy data for categories, products, and orders
const categories = [
    {
        category: 'ECG',
        image: './cat1.png',
        description: 'Electrocardiograms (ECGs) are vital tests that monitor the heart\'s electrical activity...',
        products: [
            {
                product_id: 1,
                title: 'Resting ECG',
                desc: 'This is the product description...',
                image: '/prod1banner.png',
                reports_within: '15 hours',
                contains_tests: 10,
                price: 2599
            },
            {
                product_id: 2,
                title: 'Stress ECG',
                desc: 'This is the product description...',
                image: '/prod1banner.png',
                reports_within: '12 hours',
                contains_tests: 8,
                price: 2599
            }
        ]
    },
    {
        category: 'X-Ray',
        image: './cat2.png',
        description: 'X-rays utilize radiation to create images of the body\'s internal structures...',
        products: [
            {
                product_id: 3,
                title: 'Chest X-Ray',
                desc: 'This is the product description...',
                image: '/prod1banner.png',
                reports_within: '10 hours',
                contains_tests: 1,
                price: 2599
            },
            {
                product_id: 4,
                title: 'Abdominal X-Ray',
                desc: 'This is the product description...',
                image: '/prod1banner.png',
                reports_within: '14 hours',
                contains_tests: 1,
                price: 2599
            }
        ]
    },
    {
        category: 'Pathology',
        image: './cat3.png',
        description: 'Pathology involves analyzing bodily fluids and tissues to identify diseases...',
        products: [
            {
                product_id: 5,
                title: 'Blood Test',
                desc: 'This is the product description...',
                image: '/prod1banner.png',
                reports_within: '5 hours',
                contains_tests: 20,
                price: 2599
            },
            {
                product_id: 6,
                title: 'Urine Test',
                desc: 'This is the product description...',
                image: '/prod1banner.png',
                reports_within: '7 hours',
                contains_tests: 12,
                price: 2599
            }
        ]
    }
];

const orders = [
    { id: 1, product_id: 1, status: 'Pending' },
    { id: 2, product_id: 2, status: 'Completed' },
];

// Create a custom data provider
const dataProvider = {
    getList: (resource, params) => {
        switch (resource) {
            case 'categories':
                return Promise.resolve({ data: categories, total: categories.length });
            case 'orders':
                return Promise.resolve({ data: orders, total: orders.length });
            default:
                return Promise.reject(new Error('Unknown resource'));
        }
    },
    getOne: (resource, params) => {
        switch (resource) {
            case 'categories':
                const category = categories.find(cat => cat.category === params.id);
                return Promise.resolve({ data: category });
            case 'orders':
                const order = orders.find(o => o.id === params.id);
                return Promise.resolve({ data: order });
            default:
                return Promise.reject(new Error('Unknown resource'));
        }
    },
    create: (resource, params) => {
        switch (resource) {
            case 'orders':
                const newOrder = { id: orders.length + 1, ...params.data };
                orders.push(newOrder);
                return Promise.resolve({ data: newOrder });
            default:
                return Promise.reject(new Error('Unknown resource'));
        }
    },
    update: (resource, params) => {
        switch (resource) {
            case 'orders':
                const index = orders.findIndex(order => order.id === params.id);
                orders[index] = { ...orders[index], ...params.data };
                return Promise.resolve({ data: orders[index] });
            default:
                return Promise.reject(new Error('Unknown resource'));
        }
    },
    delete: (resource, params) => {
        switch (resource) {
            case 'orders':
                const orderIndex = orders.findIndex(order => order.id === params.id);
                const deletedOrder = orders[orderIndex];
                orders.splice(orderIndex, 1);
                return Promise.resolve({ data: deletedOrder });
            default:
                return Promise.reject(new Error('Unknown resource'));
        }
    },
};

export default dataProvider;
