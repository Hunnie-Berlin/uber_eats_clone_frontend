import React from "react";

interface IDishProps {
  name: string;
  price: number;
  photo: string | null;
  description: string;
}

const Dish: React.FC<IDishProps> = ({ name, price, photo, description }) => {
  return (
    <div className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer grid grid-cols-3">
      <div className="p-2 col-span-2 grid grid-rows-4 gap-2">
        <h2 className="text-base font-medium row-span-1">{name}</h2>
        <h3 className="text-xs font-light row-span-2">{description}</h3>
        <h4 className="text-sm font-medium row-span-1">${price}</h4>
      </div>
      <div
        className="bg-yellow-500 w-full h-full col-span-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${photo})` }}
      ></div>
    </div>
  );
};

export default Dish;
