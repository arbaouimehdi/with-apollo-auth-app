import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";

import { SEND_RESET_PASSWORD } from "../lib/queries";

class SendResetPasswordBox extends Component {
  constructor(props) {
    super();
    this.state = {
      resetPasswordStatus: "NOT SENT",
    };
  }

  handleError(error) {
    console.log(error);
  }

  render() {
    let email;

    if (this.state.resetPasswordStatus === "NOT SENT") {
      return (
        <Mutation
          mutation={SEND_RESET_PASSWORD}
          // Mutation Successfully completed
          onCompleted={data => {
            if (data) {
              this.setState({
                resetPasswordStatus: "SENT",
              });
            }
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
                  <p key={`error-${index}`}>
                    {functionError ? functionError.message : ""}
                  </p>
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

    if (this.state.resetPasswordStatus === "SENT") {
      return <h1>Check your email for the Password Reset URL</h1>;
    }
  }
}

export default withApollo(SendResetPasswordBox);
