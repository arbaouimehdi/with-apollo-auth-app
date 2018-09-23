import React, { Component } from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import cookie from "cookie";

import { CURRENT_USER, UPDATE_USER_INFOS } from "../lib/queries";

class UpdateUserInfosBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
    };
  }

  onChangeName = e => {
    this.setState({
      name: e.target.value,
    });
  };

  render() {
    let name;

    return (
      <Query query={CURRENT_USER}>
        {({ data, loading, error, refetch }) => {
          if (loading) return <div>loading</div>;

          if (error) return console.log(error);

          if (data) {
            let { user } = data;

            return (
              <Mutation
                mutation={UPDATE_USER_INFOS}
                onCompleted={data => {}}
                onError={error => {}}
              >
                {(updateUserInfos, { loading, error, data }) => {
                  return (
                    <div className="authForm">
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          e.stopPropagation();

                          updateUserInfos({
                            variables: {
                              token:
                                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDAzMjIyOTQsImlhdCI6MTUzNzczMDI5NCwicHJvamVjdElkIjoiY2ptM2hnMXo2MTN6ZjAxNDVpaGw1aG5qNyIsInVzZXJJZCI6ImNqbWV1MjNmeTBnbTcwMTM0eXJsZnU1YmgiLCJtb2RlbE5hbWUiOiJVc2VyIn0.j5HzTsHdRNYmfheqldDjG0T0Ro9dVzhpSVKhQWJFrsg",
                              newName: name.value,
                            },
                          });
                        }}
                      >
                        {loading && <div>Loading</div>}

                        {error &&
                          error.graphQLErrors.map(
                            ({ functionError }, index) => (
                              <div
                                className="Alert Alert--error"
                                key={`error-${index}`}
                              >
                                {functionError.message}
                              </div>
                            ),
                          )}

                        {data &&
                          setTimeout(() => {
                            <div className="Alert Alert--success">
                              Updated Successfully
                            </div>;
                          }, 8000)}

                        <div>
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            name="name"
                            ref={node => {
                              name = node;
                            }}
                            className="Input Input-Text"
                            defaultValue={user.name}
                            onChange={this.onChangeName}
                          />
                        </div>
                        <div>
                          <label htmlFor="email">Email</label>
                          <input
                            type="text"
                            name="email"
                            className="Input Input-Text Input-Text--disabled"
                            defaultValue={user.email}
                            disabled
                          />
                        </div>
                        <div>
                          <button className="Btn Btn--primary">Update</button>
                        </div>
                      </form>
                    </div>
                  );
                }}
              </Mutation>
            );
          }
        }}
      </Query>
    );
  }
}

export default withApollo(UpdateUserInfosBox);
