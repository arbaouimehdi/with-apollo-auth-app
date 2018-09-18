import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import cookie from "cookie";
import { graphql } from "react-apollo";
import redirect from "../lib/redirect";

// const ActivateAccountBox = props => {
//   return (
//     <div>
//       <h1>{console.log(props)}</h1>
//     </div>
//   );
// };

// export default withApollo(ActivateAccountBox);

class ActivateAccountBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>{console.log(this.props.data)}</h1>
      </div>
    );
  }
}

const ACTIVATE_ACCOUNT = gql`
  query AccountActivationCode($activationId: ID) {
    AccountActivationCode(id: $activationId) {
      user {
        name
      }
    }
  }
`;

export default graphql(ACTIVATE_ACCOUNT, {
  props: ({ data }) => ({
    data,
  }),
  options(ownProps) {
    return {
      variables: {
        activationId: "cjm6rfntu15dz0117oaznx76s",
      },
    };
  },
})(withApollo(ActivateAccountBox));
