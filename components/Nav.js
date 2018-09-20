import React from "react";
import Link from "next/link";
import { withApollo } from "react-apollo";

class Nav extends React.Component {
  render() {
    return (
      <div>
        <Link prefetch href="/">
          <a>Home</a>
        </Link>
        &nbsp;-&nbsp;
        <Link prefetch href="/services">
          <a>Services</a>
        </Link>
        &nbsp;-&nbsp;
        <Link prefetch href="/signin">
          <a>Signin</a>
        </Link>
        &nbsp;-&nbsp;
        <Link prefetch href="/create-account">
          <a>Create Account</a>
        </Link>
        &nbsp;-&nbsp;
        <Link prefetch href="/reset-password">
          <a>Forgot Password</a>
        </Link>
        <hr />
      </div>
    );
  }
}

export default withApollo(Nav);
