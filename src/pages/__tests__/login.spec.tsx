import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { LOGIN_MUTATION } from "../login";

import React from "react";
import Login from "../login";
import { HelmetProvider } from "react-helmet-async";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <HelmetProvider>
            <Router>
              <Login />
            </Router>
          </HelmetProvider>
        </ApolloProvider>
      );
    });
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Uber Eats Clone");
    });
  });

  it("displays errors for email", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, "this@wont");
    });
    const errorMessageWithInvalidEmail = getByRole("alert");
    expect(errorMessageWithInvalidEmail).toHaveTextContent(
      /email is not valid/i
    );
    await waitFor(() => {
      userEvent.clear(email);
    });
    const errorMessageWithNoEmail = getByRole("alert");
    expect(errorMessageWithNoEmail).toHaveTextContent(/email is required/i);
  });

  it("displays errors for password", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const password = getByPlaceholderText(/password/i);
    await waitFor(() => {
      userEvent.type(password, "this");
    });
    const errorMessageWithShortPassword = getByRole("alert");
    expect(errorMessageWithShortPassword).toHaveTextContent(
      /password must be more than 8 charactors./i
    );
    await waitFor(() => {
      userEvent.clear(password);
    });
    const errorMessageWithNoPassword = getByRole("alert");
    expect(errorMessageWithNoPassword).toHaveTextContent(
      /password is required/i
    );
  });

  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const formData = {
      email: "test@email.com",
      password: "test1234",
    };
    const mockedMutationRespose = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: "mutation error",
        },
      },
    });
    jest.spyOn(Storage.prototype, "setItem");
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationRespose);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationRespose).toHaveBeenCalledTimes(1);
    expect(mockedMutationRespose).toHaveBeenCalledWith({
      loginInput: formData,
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/mutation error/i);
    expect(localStorage.setItem).toHaveBeenCalledWith("uber-token", "XXX");
  });
});
