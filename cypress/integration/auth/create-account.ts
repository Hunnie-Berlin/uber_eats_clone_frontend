describe("Create Account", () => {
  const user = cy;
  it("should see email / password validation errors", () => {
    user.visit("/");
    user.findByRole("link").click();
    user.findByPlaceholderText(/email/i).type("invalid@email");
    user.findByRole("alert").should("have.text", "Email is not valid");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("valid@email.com");
    user.findByPlaceholderText(/password/i).type("short");
    user
      .findByRole("alert")
      .should("have.text", "Password must be more than 8 charactors.");
    user.findByPlaceholderText(/password/i).clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create accout and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({ fixture: "auth/create-account.json" });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("test@email.com");
    user.findByPlaceholderText(/password/i).type("test1234");
    user.findByRole("button").click();
    user.wait(1000);
    user.title().should("eq", "Login | Uber Eats Clone");
    user.login("test@email.com", "test1234");
  });
});
