import React from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: "Complete Blood Count",
    description: "A comprehensive blood test that measures various components and features of your blood.",
    image: "/Diabetes.webp",
    price: "₹399",
    reviews: "(120 reviews)"
  },
  {
    id: 2,
    title: "Basic Metabolic Panel",
    description: "A blood test that measures your sugar level, electrolyte balance, and kidney function.",
    image: "/Diabetes.webp",
    price: "₹499",
    reviews: "(95 reviews)"
  },
  {
    id: 3,
    title: "Lipid Panel",
    description: "A blood test that measures your cholesterol and triglycerides to assess cardiovascular health.",
    image: "/Diabetes.webp",
    price: "₹599",
    reviews: "(80 reviews)"
  },
  {
    id: 4,
    title: "Thyroid Function Test",
    description: "A test to check the function of your thyroid gland and diagnose any thyroid disorders.",
    image: "/Diabetes.webp",
    price: "₹699",
    reviews: "(60 reviews)"
  },
  {
    id: 5,
    title: "Liver Function Test",
    description: "A blood test to assess the health of your liver by measuring levels of liver enzymes, proteins, and bilirubin.",
    image: "/Diabetes.webp",
    price: "₹499",
    reviews: "(70 reviews)"
  },
  {
    id: 6,
    title: "Kidney Function Test",
    description: "A test that evaluates the health of your kidneys by checking the levels of certain substances in your blood.",
    image: "/Diabetes.webp",
    price: "₹549",
    reviews: "(85 reviews)"
  },
  {
    id: 7,
    title: "Vitamin D Test",
    description: "A blood test to check for Vitamin D deficiency, which is essential for bone health.",
    image: "/Diabetes.webp",
    price: "₹399",
    reviews: "(110 reviews)"
  },
  {
    id: 8,
    title: "Hematology Profile",
    description: "A complete profile of your blood to detect various conditions including anemia and infections.",
    image: "/Diabetes.webp",
    price: "₹449",
    reviews: "(90 reviews)"
  },
  {
    id: 9,
    title: "C-Reactive Protein (CRP) Test",
    description: "A test to measure the level of CRP in your blood, which can indicate inflammation in your body.",
    image: "/Diabetes.webp",
    price: "₹350",
    reviews: "(75 reviews)"
  },
  {
    id: 10,
    title: "Iron Studies",
    description: "A series of tests to check the levels of iron in your blood and diagnose conditions like anemia.",
    image: "/Diabetes.webp",
    price: "₹499",
    reviews: "(65 reviews)"
  }
];

  

const Services = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:mx-20 gap-4 p-4">
        {services.map(service => (
          <Link to={`/service/${service.id}`}>
          <div key={service.id} className="border rounded p-4 flex flex-col items-center w-full max-w-xs justify-center mx-auto">
            <div className="flex items-center justify-center h-28">
              <img className="h-full object-cover" src={service.image} alt={service.title} />
            </div>
            <div className="mt-4 text-center">
              <h1 className="font-semibold break-words">{service.title}</h1>
            </div>
            <div className="text-sm text-center mt-2 text-gray-600 w-fit">
              <p className="line-clamp-1 break-words">{service.description}</p>
            </div>
            <div className="flex items-center justify-center mt-2">
              <span className="text-yellow-500">★★★★☆</span>
              <span className="text-gray-600 text-sm ml-2">{service.reviews}</span>
            </div>
            <div className="flex items-center justify-between w-full mt-8">
              <h1 className="font-bold text-xl">{service.price}</h1>
              
                <button className="font-bold text-xl text-red-500">Add To Cart</button>
              
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
