import React, { useContext } from 'react';
import { UserContext } from './Context/UserContext';
import axios from "axios";
const TestResultPage = () => {
  const { orders } = useContext(UserContext);

  // Check if orders is defined and filter completed products
  const completedProducts = orders?.flatMap(order => 
    order.products.filter(product => product.productStatus === 'completed')
  ) || [];


  const handleDownloadResult = async (pdfURL) => {
    try {
        const response = await axios.get("/api/downloadresult", {
            params: { fileUrl: pdfURL }, // Ensure the query parameter matches your backend route
            responseType: 'blob',        // Set response type to blob to handle binary data
            withCredentials: true,       // Include cookies if needed
        });

        // Create a URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        
        // Create a temporary <a> element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'testresult.pdf'); // Set the filename
        document.body.appendChild(link);
        link.click(); // Programmatically click the <a> element
        document.body.removeChild(link); // Clean up the temporary <a> element
    } catch (err) {
        console.error('Error downloading file:', err);
    }
};
  

  return (
    <div className="container mx-auto p-6 pt-24">
      <h1 className="text-2xl font-bold mb-4">Test Results</h1>
      {completedProducts.length > 0 ? (
        <ul className="space-y-4">
          {completedProducts.map(product => (
            <li key={product._id} className="p-4 border rounded shadow-lg bg-white">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-700">Quantity: {product.quantity}</p>
              <p className="text-gray-700">Price: ₹{product.price}</p>
              <p className="text-gray-700">Scheduled Date: {new Date(product.scheduledDate).toLocaleDateString()}</p>

              {/* Display test results if available */}
              {product.testResults.length > 0 ? (
                <div className="mt-2">
                  {product.testResults.map(result => (
                    <div key={result._id} className="flex items-center justify-between p-2 border-b">
                      <p className="text-gray-600">Test Date: {new Date(result.date).toLocaleDateString()}</p>

                        <button onClick={()=>{ handleDownloadResult(result.pdfLink)}} className="px-4 py-2  text-red-500 rounded ">
                          Download Test Result
                        </button>

                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No test results available for this product.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No completed products found.</p>
      )}
    </div>
  );
};

export default TestResultPage;
