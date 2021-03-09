import React from "react";
import { render, waitFor } from "@testing-library/react";
import Search from "../search";
import userEvent from "@testing-library/user-event";

const mockPush = jest.fn();

jest.mock("react-router", () => {
  const realModule = jest.requireActual("react-router");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<Search />", () => {
  it("renders OK", async () => {
    const { getByPlaceholderText } = render(<Search />);
    const input = getByPlaceholderText("Search Restaurants...");
    await waitFor(() => {
      userEvent.type(input, "test{enter}");
    });
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/search",
      search: "?term=test",
    });
  });
});
