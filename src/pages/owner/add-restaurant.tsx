import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import Button from "../../components/button";
import FormError from "../../components/form-error";
import PageTitle from "../../components/page-title";
import {
  createRestaurantMutation,
  createRestaurantMutationVariables,
} from "../../__generated__/createRestaurantMutation";
import { MY_RESTAURANTS } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurantMutation($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imgUrl, setImgUrl] = useState("");
  const onCompleted = (data: createRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { address, categoryName, name } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS });
      client.writeQuery({
        query: MY_RESTAURANTS,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  slug: categoryName.replace(/ /g, "-"),
                  __typename: "Category",
                },
                coverImg: imgUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push("/");
    }
  };
  const [createRestaurant, { data }] = useMutation<
    createRestaurantMutation,
    createRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });
  const {
    register,
    getValues,
    errors,
    formState,
    handleSubmit,
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, address, categoryName, name } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImgUrl(coverImg);
      createRestaurant({
        variables: {
          input: {
            address,
            categoryName,
            name,
            coverImg,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container flex flex-col items-center">
      <PageTitle title="Create Restaurant" />
      <div className="w-full max-w-screen-sm px-5 flex flex-col items-center">
        <h1 className="py-5 w-80 mt-5 mx-auto rounded-full text-lime-700 text-4xl font-thin bg-lime-200 flex justify-center items-center ">
          Add Restaurant
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 my-5 w-full"
        >
          <input
            className="input"
            type="text"
            required
            name="name"
            ref={register({ required: "Name is required." })}
            placeholder="Name"
          />
          <input
            className="input"
            type="text"
            required
            name="address"
            ref={register({ required: "Address is required." })}
            placeholder="Address"
          />
          <input
            className="input"
            type="text"
            required
            name="categoryName"
            ref={register({ required: "Category Name is required." })}
            placeholder="Category"
          />
          <div>
            <input
              type="file"
              name="file"
              accept="image/*"
              ref={register({ required: true })}
            />
          </div>
          <Button
            actionText="Create Restaurant"
            loading={uploading}
            canClick={formState.isValid && !uploading}
          />
          {data?.createRestaurant.error && (
            <FormError errorMessage={data.createRestaurant.error} />
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
