import React, { useContext } from 'react';
import categoriesData from './items.json'; // Adjust the path accordingly
import { Link } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const CategoriesPage = () => {

  const { categories} = useContext(UserContext);
  
  return (
    <div className="p-4 pt-20 md:pt-28 md:px-40">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.category}
            to={`/category/${category._id}`}
            className="my-4 mx-4 rounded-lg transition text-center border p-4"
          >
            <img
              src={category.catimage}
              alt={category.category}
              className="w-full  object-cover rounded mb-2"
            />
            <h3 className="text-lg font-medium">{category.category}</h3>
            <p className="text-sm text-gray-600 mt-2">{category.desc || "Description not available."}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
