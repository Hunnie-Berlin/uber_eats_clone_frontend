describe("Edit Profile", () => {
  const user = cy;

  beforeEach(() => {
    user.login("test@email.com", "test1234");
  });

  it("can go to /edit-profile using the header ", () => {
    user.get("path").click();
    user.wait(1000);
    user.title().should("eq", "Edit Profile | Uber Eats Clone");
  });

  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (
        req.body?.operationName &&
        req.body.operationName === "editProfileMutation"
      ) {
        //@ts-ignore
        req.body?.variables?.input?.email = "test@email.com";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("test02@email.com");
    user.findByRole("button").click();
  });
});
