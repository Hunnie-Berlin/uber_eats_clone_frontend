import { render } from "@testing-library/react";
import React from "react";
import FormError from "../form-error";

describe("<FormError />", () => {
  it("renders OK with props", () => {
    const { getByText } = render(<FormError errorMessage="error_message" />);
    getByText("error_message");
  });
});
