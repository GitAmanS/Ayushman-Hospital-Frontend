import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import itemsData from './items.json'; // Adjust the path as needed
import { UserContext } from './Context/UserContext';

const Categories = () => {
  const navigate = useNavigate();
  const {categories} = useContext(UserContext)
  // Function to handle category click
  const handleCategoryClick = (catid) => {
    // Navigate to the products page for the selected category
    navigate(`/category/${catid}`);
  };

  return (
    <div className="p-4 pt-4">
      <h1 className='text-lg font-bold pb-2'>Categories</h1>
      {/* Display the grid of categories */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className=" cursor-pointer rounded-lg flex flex-col  items-center"
          >
            <img src={category.catimage} alt={category.category} className="w-fit  object-cover rounded-md" />
            <h2 className="text-base text-black mt-1">{category.category}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
