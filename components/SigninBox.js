import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";

import redirect from "../lib/redirect";
import { isEmail, isLength } from "validator";

import { SIGN_IN } from "../lib/queries";

class SigninBox extends Component {
  constructor(props) {
    super();
    this.state = {
      email: "",
      password: "",
      formErrors: {
        email: {
          isEmail: false,
        },
        password: {
          isLength: false,
        },
      },
    };
  }

  handleChangeEmail = e => {
    this.setState({
      formErrors: {
        email: {
          isEmail: isEmail(e.target.value),
        },
        password: {
          isLength: this.state.formErrors.password.isLength,
        },
      },
    });
  };

  handleChangePassword = e => {
    this.setState({
      formErrors: {
        email: {
          isEmail: this.state.formErrors.email.isEmail,
        },
        password: {
          isLength: isLength(e.target.value, { min: 4, max: 20 }),
        },
      },
    });
  };

  render() {
    let email, password;

    return (
      <Mutation
        mutation={SIGN_IN}
        onCompleted={data => {
          // Store the token in cookie
          document.cookie = cookie.serialize(
            "token",
            data.authenticateUser.token,
            {
              maxAge: 30 * 24 * 60 * 60, // 30 days
            },
          );
          // Force a reload of all the current queries now that the user is
          // logged in
          this.props.client.cache.reset().then(() => {
            redirect({}, "/");
          });
        }}
        onError={error => {
          error.graphQLErrors.map(({ functionError }) =>
            console.log(functionError.message),
          );
        }}
      >
        {(authenticateUser, { loading, error, data }) => {
          return (
            <div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  authenticateUser({
                    variables: {
                      email: email.value,
                      password: password.value,
                    },
                  });

                  // email.value = password.value = "";
                }}
              >
                {loading && <div>Loading</div>}

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
                  onChange={this.handleChangeEmail}
                  required
                />
                <br />
                <input
                  name="password"
                  placeholder="Password"
                  ref={node => {
                    password = node;
                  }}
                  type="password"
                  onChange={this.handleChangePassword}
                  required
                />
                <br />
                {JSON.stringify(this.state.formErrors)}
                <button
                  disabled={
                    this.state.formErrors.email.isEmail &&
                    this.state.formErrors.password.isLength
                      ? false
                      : true
                  }
                >
                  Sign in
                </button>
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withApollo(SigninBox);
