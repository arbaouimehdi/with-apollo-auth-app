import { fromEvent, FunctionEvent } from "graphcool-lib";
import { GraphQLClient } from "graphql-request";
import * as bcrypt from "bcryptjs";
import * as validator from "validator";

import { capitalize } from "../helper/helpers";

interface User {
  id: string;
  name: string;
  email: string;
}

interface EventData {
  name: string;
  email: string;
  password: string;
}

const SALT_ROUNDS = 10;

export default async (event: FunctionEvent<EventData>) => {
  console.log(event);

  try {
    const graphcool = fromEvent(event);
    const api = graphcool.api("simple/v1");

    const { name, email, password } = event.data;

    /**
     *
     * Name Validations
     *
     */

    // not empty
    if (validator.isEmpty(name)) {
      return {
        error: {
          message: "Name is empty",
        },
      };
    }

    // alphabet only
    if (!validator.isAlpha(name)) {
      return {
        error: {
          message: "Please enter alphabetes only",
        },
      };
    }

    // minimum 4 characters
    if (!validator.isLength(name, { min: 4 })) {
      return {
        error: {
          message: "Please Choose 4 or more character for full name",
        },
      };
    }

    // maximum 20 characters
    if (!validator.isLength(name, { max: 20 })) {
      return {
        error: {
          message: "The Full Name is too long",
        },
      };
    }

    /**
     *
     * Email Validations
     *
     */
    if (!validator.isEmail(email)) {
      return {
        error: {
          message: "Not a valid email",
        },
      };
    }

    // check if user exists already
    const userExists: boolean = await getUser(api, email).then(
      r => r.User !== null,
    );
    if (userExists) {
      return {
        error: {
          message: "Email already in use",
        },
      };
    }

    // create password hash
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    // create new user
    const userId = await createGraphcoolUser(
      api,
      capitalize(name),
      email,
      hash,
    );

    // generate node token for new User node
    const token = await graphcool.generateNodeToken(userId, "User");

    return { data: { id: userId, token, name, email } };
  } catch (e) {
    console.log(e);
    return {
      error: {
        message: "An unexpected error occured during signup.",
      },
    };
  }
};

async function getUser(api: GraphQLClient, email: string): Promise<{ User }> {
  const query = `
    query getUser($email: String!) {
      User(email: $email) {
        id
      }
    }
  `;

  const variables = {
    email,
  };

  return api.request<{ User }>(query, variables);
}

async function createGraphcoolUser(
  api: GraphQLClient,
  name: string,
  email: string,
  password: string,
): Promise<string> {
  const mutation = `
    mutation createGraphcoolUser($name: String!, $email: String!, $password: String!) {
      createUser(
        name: $name
        email: $email,
        password: $password
      ) {
        id
        name
        email
      }
    }
  `;

  const variables = {
    name,
    email,
    password: password,
  };

  return api
    .request<{ createUser: User }>(mutation, variables)
    .then(r => r.createUser.id);
}
