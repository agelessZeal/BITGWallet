import { ApolloClient, from, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { getGraphUris } from '../util/networks';
import apolloLogger from './apollo_logger';

const getLink = (httpLink, wsLink) =>
	split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
		},
		wsLink,
		httpLink
	);

const getApolloClient = (networkId) => {
	const { httpUri, wsUri } = getGraphUris(networkId);
	if (httpUri) {
		const httpLink = new HttpLink({ uri: httpUri });
		const wsLink = new WebSocketLink({ uri: wsUri, options: { reconnect: true } });
		return new ApolloClient({
			link: from([apolloLogger, getLink(httpLink, wsLink)]),
			cache: new InMemoryCache(),
		});
	} else return null;
};
export default getApolloClient;
