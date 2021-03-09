import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import CreateAccount, { CREATE_ACCOUNT_MUTATION } from "../create-account";
import { render, waitFor, RenderResult } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/globalTypes";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it("resders Ok", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Uber Eats Clone");
    });
  });

  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "wont@work");
    });
    const errorMassageWithInvalidEmail = getByRole("alert");
    expect(errorMassageWithInvalidEmail).toHaveTextContent(
      /email is not valid/i
    );
    await waitFor(() => {
      userEvent.clear(email);
    });
    const errorMassageWithNoEmail = getByRole("alert");
    expect(errorMassageWithNoEmail).toHaveTextContent(/email is required/i);
    await waitFor(() => {
      userEvent.type(email, "working@email.com");
      userEvent.click(button);
    });
    const errorMassageWithNoPassword = getByRole("alert");
    expect(errorMassageWithNoPassword).toHaveTextContent(
      /password is required/i
    );
    await waitFor(() => {
      userEvent.type(password, "short");
    });
    const errorMassageWithShortPassword = getByRole("alert");
    expect(errorMassageWithShortPassword).toHaveTextContent(
      /password must be more than 8 charactors./i
    );
  });

  it("submits mutation with form values", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    const formData = {
      email: "working@email.com",
      password: "working_password",
      role: UserRole.Client,
    };
    const mockedCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation_error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedCreateAccountMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccountMutationResponse).toHaveBeenCalledWith({
      createAccountInput: formData,
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now");
    const mutationError = getByRole("alert");
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mutationError).toHaveTextContent(/mutation_error/i);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
