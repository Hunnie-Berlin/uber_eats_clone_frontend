describe("Log In", () => {
  const user = cy;

  it("should see login page", () => {
    user.visit("/").title().should("eq", "Login | Uber Eats Clone");
  });

  it("can see email / password validation errors", () => {
    user.visit("/");
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

  it("can fill out the form and login", () => {
    user.login("test@email.com", "test1234");
  });
});
