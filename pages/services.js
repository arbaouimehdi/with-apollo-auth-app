import React, { Component } from "react";

import withAuth from "../lib/withAuth";

class Services extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Services</h1>
        <span>current user: {this.props.user.email}</span>
      </div>
    );
  }
}

export default withAuth(session => session && session.userId)(Services);
