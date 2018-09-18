import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import redirect from "../lib/redirect";

const ACTIVATION_CODE = gql`
  query checkActivation($activationCode: ID!) {
    AccountActivationCode(id: $activationCode) {
      user {
        accountActivated
      }
    }
  }
`;

class ActivateAccountBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    const { activateAccount, activationStatus } = this.props;

    console.log(this.props);

    // If the Code Activation doesn't exist
    if (activationStatus == "DOESNT EXIST") {
      // Redirect the User to the login page
      redirect({}, "/signin");
    }

    // If the Account is not activated
    if (activationStatus == "NOT ACTIVATED") {
      // Activate the account
      activateAccount();
      this.setState({
        message: "Account activated successfully <a href='/signin'>Signin</a>",
      });
    }

    // If the Account is already activated
    if (activationStatus == "ALREADY ACTIVATED") {
      // Show The success message plus the login page
      redirect({}, "/signin");
    }
  }

  render() {
    return <div>{this.state.message}</div>;
  }
}

export default withApollo(ActivateAccountBox);
