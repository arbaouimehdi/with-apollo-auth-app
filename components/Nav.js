import React, { Component } from "react";
import Link from "next/link";

export default class Nav extends Component {
  render() {
    return (
      <div>
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
