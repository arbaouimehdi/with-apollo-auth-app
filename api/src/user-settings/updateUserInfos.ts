import { fromEvent, FunctionEvent } from "graphcool-lib";
import { GraphQLClient } from "graphql-request";
import * as validator from "validator";

// Query Parameters
interface EventData {
  token: string;
  newName: string;
}

interface UpdatedUser {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoggedInUser {
  id: string;
}

export default async (event: FunctionEvent<EventData>) => {
  console.log(event);

  try {
    const { token, newName } = event.data;

    const graphcool = fromEvent(event);
    const api = graphcool.api("simple/v1", { token });

    // check if the token is defined
    if (!token) {
      return {
        error: {
          message: "token is not defined",
        },
      };
    }

    // Get the logged in user
    const loggedInUser: LoggedInUser = await getLoggedInUserID(api).then(
      r => r.loggedInUser,
    );

    // check if the token belong to a user
    if (!loggedInUser) {
      return {
        error: {
          message: "No User Exist using this token",
        },
      };
    }

    // get user by id
    const user: User = await getUserByID(api, loggedInUser.id).then(
      r => r.User,
    );

    // Check the updated fields
    if (
      // newName - alphabet only
      !validator.isAlpha(newName.replace(" ", "")) ||
      // newName - between 4 & 20 characters
      !validator.isLength(newName, { min: 4, max: 20 })
    ) {
      return {
        error: {
          message: "Update User Infos Failed",
        },
      };
    }

    // Update the infos
    const updatedUser: UpdatedUser = await updateUser(api, user.id, newName);

    // Return the updated Infos
    return {
      data: {
        name: updatedUser.name,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      error: {
        message: "An unexpected error occured during the update user infos.",
      },
    };
  }
};

async function getUserByID(api: GraphQLClient, id: string): Promise<{ User }> {
  const query = `
    query getUserByID($id: ID!) {
      User(id: $id) {
        id
        name
        email
      }
    }
  `;
  const variables = {
    id,
  };

  return api.request<{ User }>(query, variables);
}

async function getLoggedInUserID(api: GraphQLClient): Promise<any> {
  const query = `
    query {
      loggedInUser {
        id
    }
  }
  `;

  return api.request<{ LoggedInUser }>(query);
}

async function updateUser(
  api: GraphQLClient,
  loggedInUserID: string,
  newName: string,
): Promise<UpdatedUser> {
  const mutation = `
    mutation updateUser($loggedInUserID: ID!, $newName: String!) {
      updateUser(id: $loggedInUserID, name: $newName) {
        name
      }
    }
  `;
  const variables = {
    loggedInUserID,
    newName,
  };

  return api
    .request<{ updateUser: UpdatedUser }>(mutation, variables)
    .then(r => r.updateUser);
}
