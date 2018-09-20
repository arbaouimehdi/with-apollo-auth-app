import React from "react";
import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";

import { CREATE_USER, SEND_CONFIRMATION } from "../lib/queries";

import SendConfirmationBox from "../components/SendConfirmationBox";

class RegisterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccountStatus: "NOT CREATED",
      userId: "",
      userName: "",
      userEmail: "",
    };
  }

  handleError = error => {
    console.log(error);
  };

  render() {
    let name, email, password;

    if (this.state.createAccountStatus === "NOT CREATED") {
      return (
        <Mutation
          mutation={CREATE_USER}
          onCompleted={data => {
            document.cookie = cookie.serialize("token", data.signupUser.token, {
              maxAge: 30 * 24 * 60 * 60, // 30 days
            });

            this.setState({
              createAccountStatus: "CREATED",
              userId: data.signupUser.id,
              userName: data.signupUser.name,
              userEmail: data.signupUser.email,
            });
          }}
          onError={error => {
            this.handleError(error);
          }}
        >
          {(create, { loading, error, data }) => (
            <div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();

                  create({
                    variables: {
                      name: name.value,
                      email: email.value,
                      password: password.value,
                    },
                  });

                  name.value = email.value = password.value = "";
                }}
              >
                {loading && <div>Loading</div>}

                {error &&
                  error.graphQLErrors.map(({ functionError }, index) => (
                    <p key={`error-${index}`}>{functionError.message}</p>
                  ))}
                <input
                  name="name"
                  placeholder="Name"
                  ref={node => {
                    name = node;
                  }}
                  type="text"
                />
                <br />
                <input
                  name="email"
                  placeholder="Email"
                  ref={node => {
                    email = node;
                  }}
                  type="text"
                />
                <br />
                <input
                  name="password"
                  placeholder="Password"
                  ref={node => {
                    password = node;
                  }}
                  type="password"
                />
                <br />
                <button>Register</button>
              </form>
            </div>
          )}
        </Mutation>
      );
    }

    if (this.state.createAccountStatus === "CREATED") {
      return (
        <Mutation
          mutation={SEND_CONFIRMATION}
          variables={{
            userId: this.state.userId,
            userName: this.state.userName,
            userEmail: this.state.userEmail,
          }}
          onError={error => {
            this.handleError(error);
          }}
        >
          {(sendConfirmationCode, { loading, error }) => (
            <SendConfirmationBox sendConfirmationCode={sendConfirmationCode} />
          )}
        </Mutation>
      );
    }
  }
}

export default withApollo(RegisterBox);
