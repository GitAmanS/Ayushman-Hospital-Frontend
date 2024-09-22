import React from 'react';
import categoriesData from './items.json'; // Adjust the path accordingly
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  return (
    <div className="p-4 pt-20">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categoriesData.categories.map((category) => (
          <Link
            key={category.category}
            to={`/category/${category.category}`}
            className="my-4 mx-4 rounded-lg transition text-center border p-4"
          >
            <img
              src={category.image}
              alt={category.category}
              className="w-full  object-cover rounded mb-2"
            />
            <h3 className="text-lg font-medium">{category.category}</h3>
            <p className="text-sm text-gray-600 mt-2">{category.description || "Description not available."}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
