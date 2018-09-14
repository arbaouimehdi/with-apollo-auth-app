import React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import * as Cookies from "es-cookie";
import { gql } from "apollo-boost";

import redirect from "../lib/redirect";

import Signin from "./../pages/signin";

const GET_CURRENT_USER = gql`
  query {
    loggedInUser {
      id
      name
      email
    }
  }
`;

const withAuth = conditionFunc => Component => props => {
  if (props.unitTesting === "true") {
    return <Component {...props} />;
  }

  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, loading, error, refetch }) => {
        if (loading) {
          return null;
        }

        if (typeof document !== "undefined") {
          const tokenExpired = Cookies.get("token");

          if (tokenExpired == undefined)
            // return <Redirect to="/signin" />;
            return (
              <div>
                <p>Nothing to show</p>
              </div>
            );
        }

        if (data.loggedInUser == null) {
          return <div>loading</div>;
        }

        console.log(data);
        return data.loggedInUser.id ? (
          <Component {...props} user={data.loggedInUser} />
        ) : (
          <div>xxxx</div>
          // <Redirect to="/signin" />
        );
      }}
    </Query>
  );
};

export default withAuth;
