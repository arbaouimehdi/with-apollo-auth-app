import { Mutation, withApollo } from "react-apollo";
import cookie from "cookie";
import redirect from "../lib/redirect";

import { SIGN_IN } from "../lib/queries";

// TODO: Find a better name for component.
const SigninBox = ({ client }) => {
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
        client.cache.reset().then(() => {
          redirect({}, "/");
        });
      }}
      onError={error => {
        error.graphQLErrors.map(({ functionError }) =>
          console.log(functionError.message),
        );
      }}
    >
      {(authenticateUser, { data, error }) => (
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

              email.value = password.value = "";
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
            <button>Sign in</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

export default withApollo(SigninBox);
