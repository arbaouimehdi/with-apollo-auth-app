import React, { Component } from "react";
import Link from "next/link";

import SendResetPasswordBox from "../components/SendResetPasswordBox";

class ResetPassword extends Component {
  render() {
    return (
      <React.Fragment>
        <SendResetPasswordBox />
        <hr />
        Already a member?{" "}
        <Link prefetch href="/signin">
          <a>Signin</a>
        </Link>
      </React.Fragment>
    );
  }
}

export default ResetPassword;
