import React from 'react';
import { useParams } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: "Complete Blood Count",
    description: "A comprehensive blood test that measures various components and features of your blood.",
    image: "/Diabetes.webp",
    price: "₹399",
    reviews: "(120 reviews)",
    detailedDescription: "Detailed information about the Complete Blood Count service goes here."
  },
  // Add more service objects as needed
];

const ServiceDetail = () => {
  const { id } = useParams();
  const service = services.find(service => service.id === parseInt(id));

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="p-8 flex flex-row">
      <div className="productimage max-w-4xl mx-auto">
        <img src={service.image} alt={service.title} className="h-64 object-cover rounded" />
      </div>
      <div className='productdesc flex flex-col max-w-xs mx-4'>
        <h1 className="text-xl font-bold mt-4">{service.title}</h1>
        <p className="text-gray-600 mt-2 line-clamp-3">{service.detailedDescription}</p>
      </div>
      <div className='pricendadd flex flex-col items-start justify-between'>
        <p className="text-xl mt-2">{service.price}</p>
        <div className="mt-4">
          <button className="font-bold text-xl text-red-500">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
