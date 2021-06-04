// import ENV from './../env';
// import { ApolloLink, NextLink, Operation, ApolloClient } from '@apollo/client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-boost';
// import { setContext } from 'apollo-link-context';

import { setContext} from "@apollo/client/link/context"


import { ApolloClient, from, InMemoryCache, HttpLink, split , ApolloLink} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';



import { getToken, getExpireDateToken } from '../lib/Helpers';

const middleware = setContext(async (req, { headers }) => {
  const token = await getToken();
  const expireTokenDate = await getExpireDateToken();

  if (token === null || expireTokenDate === null || new Date(expireTokenDate) < new Date()) {
    return {
      headers,
    };
  }

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const afterware = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const context = operation.getContext();

    const {
      response: { headers },
    } = context;

    return response;
  }),
);

const httpLink = new HttpLink({
  uri: 'https://api.bitg.rocks/graphql',
  headers: {
    'content-type': 'application/json',
  },
});

const link = afterware.concat(middleware.concat(httpLink));

const getLink = (httpLink, wsLink) =>
	split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
		},
		wsLink,
		httpLink
  );
  
export function createApolloClient() {

  // const httpLink = new HttpLink({ uri: httpUri });
  // const wsLink = new WebSocketLink({ uri: wsUri, options: { reconnect: true } });

  // return new ApolloClient({
  //   link: from([apolloLogger, getLink(httpLink, wsLink)]),
  //   cache: new InMemoryCache(),
  // });

  return new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });
};