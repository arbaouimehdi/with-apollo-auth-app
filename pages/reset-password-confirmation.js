import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";

import withAuth from "../lib/withAuth";
import { CURRENT_USER, RESET_PASSWORD } from "../lib/queries";

import ResetPasswordConfirmationBox from "../components/ResetPasswordConfirmationBox";

class ResetPasswordConfirmation extends Component {
  render() {
    return (
      <React.Fragment>
        {/* Get The Current User Infos */}
        <Query query={CURRENT_USER}>
          {({ loading, error, data }) => {
            if (loading) return "loading...";

            if (error) return `Error! ${error}`;

            /**
             *
             * If the User is Logged in
             *
             */
            if (data) {
              const passwordResetCodeQuery = this.props.query.passwordResetCode;
              const currentUserResetCode = data.user.resetPassword.id;

              // Check if the Password Confirmation
              // Code Belongs to the Current User
              if (passwordResetCodeQuery === currentUserResetCode) {
                return (
                  <Mutation
                    mutation={RESET_PASSWORD}
                    variables={{
                      passwordResetCode: currentUserResetCode,
                    }}
                    onCompleted={data => {
                      console.log(data);
                    }}
                    onError={error => {
                      console.log(error);
                    }}
                  >
                    {(resetPassword, { data, error }) => (
                      <div>
                        <ResetPasswordConfirmationBox
                          resetPassword={resetPassword}
                        />
                      </div>
                    )}
                  </Mutation>
                );
              }
            }

            return (
              <div>
                <h1>Password Activation doesn't exist</h1>
              </div>
            );
          }}
        </Query>
      </React.Fragment>
    );
  }
}

export default withAuth()(ResetPasswordConfirmation);
