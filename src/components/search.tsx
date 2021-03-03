import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";

interface IFormProps {
  searchTerm: string;
}

const Search = () => {
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSearchSubmit)}
      className="bg-gray-800  w-full py-40 flex items-center justify-center"
    >
      <input
        ref={register({ required: true, minLength: 3 })}
        name="searchTerm"
        type="search"
        placeholder="Search Restaurants..."
        className="input rounded-md border-0 w-3/4 md:w-6/12"
      />
    </form>
  );
};

export default Search;
