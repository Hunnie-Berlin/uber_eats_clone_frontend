import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateOrderItemInput } from "../__generated__/globalTypes";
import { restaurantQuery_restaurant_restaurant_menu_options } from "../__generated__/restaurantQuery";

interface IDishProps {
  id?: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  isCustomer?: boolean;
  options?: restaurantQuery_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (item: CreateOrderItemInput) => void;
  removeItem?: (dishId: number) => void;
}

const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  photo,
  description,
  isCustomer = false,
  options,
  addItemToOrder,
  removeItem,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [itemAmount, setItemAmount] = useState(0);
  const { register, getValues } = useForm<{
    amount: string;
  }>();
  const onButtonClick = () => {
    const { amount, ...rest } = getValues();
    const selectedOptions = Object.fromEntries(
      Object.entries(rest).filter(([key, value]) => value === true)
    );
    const keys = Object.keys(selectedOptions);
    const options = keys.map((key) => ({ name: key }));
    const item = { dishId: id, options };
    if (!isSelected) {
      if (+amount === 0 || isNaN(+amount)) {
        return;
      } else {
        let i = 0;
        while (i < +amount) {
          addItemToOrder && addItemToOrder(item);
          i++;
        }
        setItemAmount(+amount);
        setIsSelected(!isSelected);
      }
    } else {
      removeItem && removeItem(id);
      setIsSelected(!isSelected);
    }
  };
  return (
    <div
      className={`hover:shadow-md transition-all  grid grid-cols-5  border rounded-md ${
        isSelected
          ? "bg-blue-100 shadow-md border-blue-100"
          : " hover:border-gray-300 border-gray-200"
      }`}
    >
      <div className="p-2 col-span-3 grid grid-rows-4 gap-2">
        <h2 className="text-base font-medium row-span-1">{name}</h2>
        <h3 className="text-xs font-light row-span-2">{description}</h3>
        <h4 className="text-sm font-medium row-span-1">${price}</h4>
        {isCustomer && options && options.length !== 0 && (
          <div>
            <form>
              <h5 className="text-sm font-medium text-lime-800">
                {options?.length === 1 ? "Dish Option" : "Dish Options"}
              </h5>
              {options?.map((option, index) => (
                <div className="flex items-center" key={index}>
                  <input
                    type="checkbox"
                    ref={register}
                    name={option.name}
                    className="mr-1"
                  />
                  <h6 className="text-xs font-medium text-lime-800 opacity-60">
                    {option.name}
                    {option.extraCharge === 0
                      ? " (Free)"
                      : ` ($ ${option.extraCharge})`}
                  </h6>
                </div>
              ))}
            </form>
          </div>
        )}
      </div>
      <div className="grid grid-rows-4 col-span-2">
        <div
          className="bg-yellow-500 w-full  bg-cover bg-center row-span-4 rounded-md"
          style={{ backgroundImage: `url(${photo})` }}
        ></div>
        {isCustomer && (
          <div className="grid grid-cols-7">
            {!isSelected && (
              <input
                ref={register({ valueAsNumber: true, required: true })}
                type="number"
                name="amount"
                defaultValue="0"
                min="0"
                className="bg-blue-300 col-span-2 mt-1 rounded-l-md text-right focus:outline-none"
              />
            )}
            <button
              className={`btn  row-span-1 shadow-inner mt-1 text-sm ${
                isSelected
                  ? "bg-red-400 rounded-md col-span-7"
                  : "bg-blue-500 rounded-r-md col-span-5"
              }`}
              onClick={onButtonClick}
            >
              {isSelected ? `Remove ${itemAmount} item` : "Add item"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dish;
