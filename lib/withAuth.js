import React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import * as Cookies from "es-cookie";
import { gql } from "apollo-boost";

import redirect from "../lib/redirect";

import Signin from "./../pages/signin";

const GET_CURRENT_USER = gql`
  query {
    user {
      id
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
            return <Signin {...props} refetch={refetch} />;
        }

        if (data.user == null) {
          return <div>loading</div>;
        }

        return conditionFunc(data) ? (
          <Component {...props} user={data.user} />
        ) : (
          <Redirect to="/signin" />
        );
      }}
    </Query>
  );
};

export default withAuth;