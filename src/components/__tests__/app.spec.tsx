import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "../app";
import { isLoggedInVar } from "../../apollo";

const LoggedOutRouter = () => <span>logged_out</span>;
const LoggedInRouter = () => <span>logged_in</span>;

jest.mock("../../routers/logged-out-router", () => LoggedOutRouter);
jest.mock("../../routers/logged-in-router", () => LoggedInRouter);

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />);
    getByText("logged_out");
  });
  it("renders LoggedInRouter", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("logged_in");
  });
});
