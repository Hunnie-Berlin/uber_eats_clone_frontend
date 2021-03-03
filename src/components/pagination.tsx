import React from "react";

interface IPaginationProps {
  page: number;
  totalPages: number;
  onPreviousPageClick: () => void;
  onNextPageClick: () => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  page,
  totalPages,
  onPreviousPageClick,
  onNextPageClick,
}) => {
  return (
    <div className="grid grid-cols-3 text-center max-w-md mx-auto place-items-center mt-10">
      {page > 1 ? (
        <button
          onClick={onPreviousPageClick}
          className="text-xl font-medium text-gray-100 hover:text-lime-700 transition-colors w-8 h-8 rounded-full bg-lime-500 focus:outline-none active:animate-clickAnimation"
        >
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span className="text-xl font-medium text-lime-600">
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <button
          onClick={onNextPageClick}
          className="text-xl font-medium text-gray-100 hover:text-lime-700 transition-colors w-8 h-8 rounded-full bg-lime-500 focus:outline-none active:animate-clickAnimation"
        >
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Pagination;
