import React, { Component } from "react";
import { Query } from "react-apollo";
import * as Cookies from "es-cookie";
import { gql } from "apollo-boost";

import Signin from "../pages/signin";

const GET_CURRENT_USER = gql`
  query {
    loggedInUser {
      id
    }
  }
`;

const withAuth = conditionFunc => Component => props => {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, loading, error, refetch }) => {
        if (loading) return <div>loading</div>;

        // If the User Token is Expired
        if (typeof document !== "undefined") {
          const tokenExpired = Cookies.get("token");

          if (tokenExpired == undefined) {
            return <Signin />;
          }
        }

        // If the Query return an error
        if (error) return <div>Query Error</div>;

        //
        if (data) {
          // If the Current User Exist
          return data.loggedInUser ? (
            <Component {...props} user={data.loggedInUser} />
          ) : (
            <Signin />
          );
        }
        return <div />;
      }}
    </Query>
  );
};

export default withAuth;
