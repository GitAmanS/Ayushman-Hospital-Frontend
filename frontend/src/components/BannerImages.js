import React, { useState, useEffect } from "react";

const images = [
  "/BannerImages/img1.jpg",
  "/BannerImages/img2.jpg",
  "/BannerImages/img3.jpg",
];

const BannerImages = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Automatically change to the next image every 3 seconds
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="relative w-full p-4">
      {/* Image Display */}
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full  object-cover"
              style={{ minWidth: "100%" }}
            />
          ))}
        </div>
      </div>

      {/* Indicator Line */}
      <div className="mx-auto mt-4 w-2/3 h-[2px] bg-gray-300 rounded-full flex">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-full transition-all duration-500 ${
              index === currentIndex ? "bg-black" : "bg-transparent"
            }`}
            style={{ flex: 1 }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BannerImages;
