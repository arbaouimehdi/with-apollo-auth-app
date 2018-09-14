import gql from "graphql-tag";

export default apolloClient =>
  apolloClient
    .query({
      query: gql`
        query getLoggedInUser {
          loggedInUser {
            id
          }
        }
      `,
    })
    .then(({ data }) => {
      return { loggedInUser: data.loggedInUser };
    })
    .catch(() => {
      console.log("fail");
      // Fail gracefully
      return { loggedInUser: {} };
    });
