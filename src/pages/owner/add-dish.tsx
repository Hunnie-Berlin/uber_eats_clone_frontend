import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import Button from "../../components/button";
import PageTitle from "../../components/page-title";
import {
  createDishMutation,
  createDishMutationVariables,
} from "../../__generated__/createDishMutation";
import { MY_RESTAURANT_QUERY } from "../owner/my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDishMutation($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  photo: string;
  [key: string]: string;
}

const AddDish = () => {
  const { id: restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [imgUrl, setImgUrl] = useState("");
  const {
    register,
    getValues,
    formState,
    handleSubmit,
    setValue,
  } = useForm<IForm>({ mode: "onChange" });
  const [createDish, { data }] = useMutation<
    createDishMutation,
    createDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, price, description, ...rest } = getValues();
      const optionsObj = optionsNumber.map((theId) => ({
        name: rest[`${theId}-optionName`],
        extraCharge: +rest[`${theId}-optionExtraPrice`],
      }));
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch(
          process.env.NODE_ENV === "production"
            ? "https://hunnie-eats-backend.herokuapp.com/uploads"
            : "http://localhost:4000/uploads",
          {
            method: "POST",
            body: formBody,
          }
        )
      ).json();
      setImgUrl(coverImg);
      createDish({
        variables: {
          input: {
            name,
            price: +price,
            description,
            restaurantId: +restaurantId,
            options: optionsObj,
            photo: coverImg,
          },
        },
      });
      setUploading(false);
      history.goBack();
    } catch (e) {
      console.log(e);
    }
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, null);
    setValue(`${idToDelete}-optionExtraPrice`, null);
  };
  return (
    <div className="container flex flex-col items-center">
      <PageTitle title="Add Dish" />
      <div className="w-full max-w-screen-sm px-5 flex flex-col items-center">
        <h1 className="py-5 w-80 mt-5 mx-auto rounded-full text-lime-700 text-4xl font-thin bg-lime-200 flex justify-center items-center ">
          Add Dish
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-w-screen-sm gap-3 w-full my-5"
        >
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Name"
            ref={register({ required: "Name is required" })}
          />
          <input
            className="input"
            type="number"
            step="0.01"
            min="0"
            name="price"
            placeholder="Price"
            ref={register({
              required: "Price is required",
            })}
          />
          <input
            className="input"
            type="text"
            name="description"
            placeholder="Description"
            ref={register({ required: "Description is required" })}
          />
          <div>
            <input
              type="file"
              name="file"
              accept="image/*"
              ref={register({ required: true })}
            />
          </div>
          <div className="my-10">
            <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
            <span
              onClick={onAddOptionClick}
              className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
            >
              Add Dish Option
            </span>
            {optionsNumber.length > 0 &&
              optionsNumber.map((id) => (
                <div className="mt-5 grid gap-2 grid-cols-8" key={id}>
                  <input
                    ref={register}
                    name={`${id}-optionName`}
                    className="py-2 px-5 focus:outline-none focus:border-gray-600 border-2 col-span-3"
                    type="text"
                    placeholder="Option Name"
                  />
                  <input
                    ref={register}
                    name={`${id}-optionExtraPrice`}
                    className="py-2 px-5 focus:outline-none focus:border-gray-600 border-2 col-span-3"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Option Extra Price"
                  />
                  <div
                    onClick={() => onDeleteClick(id)}
                    className="py-2 px-5 bg-gray-400 hover:bg-gray-700 text-white  active:animate-clickAnimation cursor-pointer text-center col-span-2"
                  >
                    Delete Option
                  </div>
                </div>
              ))}
          </div>
          <Button
            actionText="Create Dish"
            canClick={formState.isValid && !uploading}
            loading={uploading}
          />
        </form>
      </div>
    </div>
  );
};

export default AddDish;
