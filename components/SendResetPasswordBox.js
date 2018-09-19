import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";

const SEND_RESET_PASSWORD = gql`
  mutation sendResetPassword($userEmail: String!) {
    sendResetPasswordEmail(email: $userEmail) {
      result
    }
  }
`;

class SendResetPasswordBox extends Component {
  constructor(props) {
    super();
  }

  handleError(error) {
    console.log(error);
  }

  render() {
    let email;

    return (
      <Mutation
        mutation={SEND_RESET_PASSWORD}
        // Mutation Successfully completed
        onCompleted={data => {
          console.log(data);
        }}
        // Mutation Error
        onError={error => {
          this.handleError(error);
        }}
      >
        {(sendResetPassword, { data, error }) => (
          <form
            onSubmit={e => {
              e.preventDefault();
              e.stopPropagation();

              sendResetPassword({
                variables: {
                  userEmail: email.value,
                },
              });

              email.value = "";
            }}
          >
            {error &&
              error.graphQLErrors.map(({ functionError }, index) => (
                <p key={`error-${index}`}>{functionError.message}</p>
              ))}

            <input
              name="email"
              placeholder="Email"
              ref={node => {
                email = node;
              }}
              type="text"
            />
            <br />
            <button>Send Password</button>
          </form>
        )}
      </Mutation>
    );
  }
}

export default withApollo(SendResetPasswordBox);
