import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import GoBackBtn from "../go-back-button";

const mockGoBack = jest.fn();

jest.mock("react-router", () => {
  const realModule = jest.requireActual("react-router");
  return {
    ...realModule,
    useHistory: () => {
      return {
        goBack: mockGoBack,
      };
    },
  };
});

describe("<GoBackBtn />", () => {
  it("renders OK", () => {
    const { getByText } = render(<GoBackBtn />);
    getByText("Go Back");
  });

  it("should go back on click", async () => {
    const { getByRole } = render(<GoBackBtn />);
    const button = getByRole("button");
    await waitFor(() => {
      userEvent.click(button);
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
