import gql from "graphql-tag";

export default apolloClient =>
  apolloClient
    .query({
      query: gql`
        query getUser {
          user {
            id
            name
            email
            accountActivated
          }
        }
      `,
    })
    .then(({ data }) => {
      if (data.user.accountActivated) {
        return { loggedInUser: data };
      }
      return { loggedInUser: {} };
    })
    .catch(() => {
      console.log("fail");
      // Fail gracefully
      return { loggedInUser: {} };
    });
