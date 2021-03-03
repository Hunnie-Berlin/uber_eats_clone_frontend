import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
  return (
    <button
      className={`focus:outline-none active:animate-clickAnimation text-white p-4 border-2 text-lg font-medium  transition-colors ${
        canClick
          ? "bg-lime-500 hover:bg-lime-600"
          : "bg-gray-300 pointer-events-none"
      }`}
    >
      {loading ? "Loading.." : actionText}
    </button>
  );
};

export default Button;
