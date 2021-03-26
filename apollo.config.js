module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "uber_eats_backend",
      url:
        process.env.NODE_ENV === "production"
          ? "https://hunnie-eats-backend.herokuapp.com/graphql"
          : "http://localhost:4000/graphql",
    },
  },
};
