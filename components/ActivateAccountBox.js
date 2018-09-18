import React from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import cookie from "cookie";
import { graphql } from "react-apollo";
import redirect from "../lib/redirect";

// Mutation : Activate the Account
const ACTIVATE_ACCOUNT = gql`
  mutation ActivateAccount($activationCode: ID!) {
    activateAccount(id: $activationCode) {
      result
    }
  }
`;

class ActivateAccountBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Mutation mutation={ACTIVATE_ACCOUNT}>
        {(activateAccount, { loading, error }) => (
          <div>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                activateAccount({
                  variables: { activationCode: this.props.activationCode },
                });
              }}
            >
              Validate
            </a>
            {loading && <p>Loading...</p>}
            {error && <p>Error :( Please try again</p>}
          </div>
        )}
      </Mutation>
    );
  }
}

export default withApollo(ActivateAccountBox);
