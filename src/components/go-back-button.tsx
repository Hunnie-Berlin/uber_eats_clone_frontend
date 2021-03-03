import React from "react";
import { useHistory } from "react-router";

const GoBackBtn = () => {
  const history = useHistory();
  const onClick = () => {
    history.goBack();
  };
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={onClick}
        className="focus:outline-none active:bg-gray-600 active:animate-clickAnimation py-3 px-10  rounded-md bg-gray-800 text-white text-lg "
      >
        Go Back
      </button>
    </div>
  );
};

export default GoBackBtn;
