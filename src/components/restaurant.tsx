import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div className="flex flex-col">
        <div
          className="py-28 bg-cover bg-center mb-2"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
        <h3 className="text-xl font-semibold">{name}</h3>
        <span className="border-t-2 mt-2 py-2 border-gray-200 text-sm text-gray-400 uppercase">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};

export default Restaurant;
