import App, { Container } from "next/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import withApollo from "../lib/withApollo";

import Nav from "../components/Nav";

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Nav />
          <Component {...pageProps} query={this.props.router.query} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MyApp);
