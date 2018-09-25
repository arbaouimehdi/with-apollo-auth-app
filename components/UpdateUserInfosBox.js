import React, { Component } from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import { isLength } from "validator";

import { CURRENT_USER, UPDATE_USER_INFOS } from "../lib/queries";

class UpdateUserInfosBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      formErrors: {
        name: {
          isLength: true,
        },
        oldPassword: {
          isLength: false,
        },
        newPassword: {
          isLength: false,
        },
      },
    };
  }

  onChangeName = e => {
    this.setState({
      name: e.target.value,
      formErrors: {
        name: {
          isLength: isLength(e.target.value, { min: 4, max: 20 }),
        },
        oldPassword: {
          isLength: this.state.formErrors.oldPassword.isLength,
        },
        newPassword: {
          isLength: this.state.formErrors.newPassword.isLength,
        },
      },
    });
  };

  onChangeOldPassword = e => {
    this.setState({
      name: e.target.value,
      formErrors: {
        name: {
          isLength: this.state.formErrors.name.isLength,
        },
        oldPassword: {
          isLength: isLength(e.target.value, { min: 4, max: 20 }),
        },
        newPassword: {
          isLength: this.state.formErrors.newPassword.isLength,
        },
      },
    });
  };

  onChangeNewPassword = e => {
    this.setState({
      name: e.target.value,
      formErrors: {
        name: {
          isLength: this.state.formErrors.name.isLength,
        },
        oldPassword: {
          isLength: this.state.formErrors.oldPassword.isLength,
        },
        newPassword: {
          isLength: isLength(e.target.value, { min: 4, max: 20 }),
        },
      },
    });
  };

  render() {
    let name, oldPassword, newPassword;

    return (
      <Query query={CURRENT_USER}>
        {({ data, loading, error }) => {
          if (loading) return <div>loading</div>;

          if (error) return console.log(error);

          if (data) {
            let { user } = data;

            return (
              <Mutation
                mutation={UPDATE_USER_INFOS}
                update={(cache, { data: { updateUserInfos } }) => {
                  let { user } = cache.readQuery({ query: CURRENT_USER });
                  console.log(updateUserInfos.name);
                  cache.writeQuery({
                    query: CURRENT_USER,
                    data: {
                      user: {
                        id: user.id,
                        name: updateUserInfos.name,
                        email: user.email,
                        accountActivated: user.accountActivated,
                        __typename: "UpdateUserInfosPayload",
                      },
                    },
                  });
                }}
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
                              token: document.cookie.replace("token=", ""),
                              newName: name.value,
                              oldPassword: oldPassword.value,
                              newPassword: newPassword.value,
                            },
                          });

                          oldPassword.value = newPassword.value = "";
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

                        {/* Updated Successfully */}
                        {data && (
                          <div className="Alert Alert--success">
                            Updated Successfully
                          </div>
                        )}

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
                          <label htmlFor="oldPassword">Old Password</label>
                          <input
                            type="text"
                            name="oldPassword"
                            ref={node => {
                              oldPassword = node;
                            }}
                            className="Input Input-Text"
                            onChange={this.onChangeOldPassword}
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword">New Password</label>
                          <input
                            type="text"
                            name="newPassword"
                            ref={node => {
                              newPassword = node;
                            }}
                            className="Input Input-Text"
                            onChange={this.onChangeNewPassword}
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
                          <button
                            className="Btn Btn--primary"
                            disabled={
                              this.state.formErrors.name.isLength &&
                              this.state.formErrors.oldPassword.isLength &&
                              this.state.formErrors.newPassword.isLength
                                ? false
                                : true
                            }
                          >
                            Update
                          </button>
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
