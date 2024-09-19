import React from 'react';
import { useNavigate } from 'react-router-dom';
import itemsData from './items.json'; // Adjust the path as needed

const Categories = () => {
  const navigate = useNavigate();

  // Function to handle category click
  const handleCategoryClick = (category) => {
    // Navigate to the products page for the selected category
    navigate(`/category/${category.category}`);
  };

  return (
    <div className="p-4 pt-32">
      <h1 className='text-xl font-semibold pb-2'>Categories</h1>
      {/* Display the grid of categories */}
      <div className="grid grid-cols-3 gap-4">
        {itemsData.categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category)}
            className=" cursor-pointer rounded-lg flex flex-col  items-center"
          >
            <img src={category.image} alt={category.category} className="w-fit  object-cover rounded-md" />
            <h2 className="text-base text-black mt-1">{category.category}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
