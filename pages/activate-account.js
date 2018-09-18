import React, { Component } from "react";
import gql from "graphql-tag";
import redirect from "../lib/redirect";

import ActivateAccountBox from "../components/ActivateAccountBox";

export default class ActivateAccount extends Component {
  render() {
    return (
      <React.Fragment>
        <ActivateAccountBox
          activationCode={this.props.query.accountActivationCode}
        />
      </React.Fragment>
    );
  }
}
