import { ApolloProvider } from '@apollo/client';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getApolloClient from './apollo_client_config';

const ApolloProviderWrapper = ({ children, provider }) => {
	const client = React.useMemo(() => getApolloClient(provider.chainId), [provider.chainId]);
	if (client) {
		return <ApolloProvider client={client}>{children}</ApolloProvider>;
	} else {
		return <>{children}</>
	}
	
};

const mapStateToProps = state => ({
	provider: state.engine.backgroundState.NetworkController.provider
});

ApolloProviderWrapper.propTypes = {
	children: PropTypes.node,
	provider: PropTypes.object
};

export default connect(mapStateToProps)(ApolloProviderWrapper);
