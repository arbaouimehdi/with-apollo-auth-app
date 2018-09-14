import React from "react";
import Link from "next/link";

import redirect from "../lib/redirect";
import checkLoggedIn from "../lib/checkLoggedIn";

import SigninBox from "../components/SigninBox";

export default class Signin extends React.Component {
  static async getInitialProps(context) {
    console.log(context);
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);

    if (loggedInUser.user) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, "/");
    }

    return {};
  }

  render() {
    return (
      <React.Fragment>
        {/* SigninBox handles all login logic. */}
        <div>
          <SigninBox />
          <hr />
          New?{" "}
          <Link prefetch href="/create-account">
            <a>Create account</a>
          </Link>
        </div>
      </React.Fragment>
    );
  }
}
