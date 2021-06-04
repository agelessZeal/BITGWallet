import { ApolloLink } from '@apollo/client';

const formatMessage = (operationType, operation, ellapsed) => {
	const headerCss = [
		'color: gray; font-weight: lighter', // title
		`color: ${operationType === 'query' ? '#03A9F4' : 'red'};`, // operationType
		'color: inherit;' // operationName
	];

	const parts = ['%c apollo', `%c${operationType}`, `%c${operation.operationName}`];

	if (operationType !== 'subscription') {
		parts.push(`%c(in ${ellapsed} ms)`);
		headerCss.push('color: gray; font-weight: lighter;'); // time
	}

	return [parts.join(' '), ...headerCss];
};

const bindToConsole = (consoleMethod, polyfill) => (consoleMethod ? consoleMethod.bind(console) : polyfill);

const logging = (() => {
	let prefix = '';
	const consoleLog = (...args) => {
		console.log(prefix, ...args);
	};
	const consoleError = (...args) => {
		console.error(prefix, ...args);
	};
	const consoleGroup = (...args) => {
		consoleLog(...args);
		prefix += '> ';
	};
	const consoleGroupEnd = () => {
		prefix = prefix.slice(0, -2);
	};
	return {
		log: consoleLog,
		error: consoleError,
		group: bindToConsole(console.group, consoleGroup),
		groupCollapsed: bindToConsole(console.groupCollapsed, consoleGroup),
		groupEnd: bindToConsole(console.groupEnd, consoleGroupEnd)
	};
})();
const apolloLogger = new ApolloLink((operation, forward) => {
	const startTime = new Date().getTime();
	return forward(operation).map(result => {
		const definition = operation.query.definitions[0];
		const operationType = definition.operation ? definition.operation : definition.kind;
		const ellapsed = new Date().getTime() - startTime;
		const group = formatMessage(operationType, operation, ellapsed);
		logging.groupCollapsed(...group);
		logging.log('INIT', operation);
		logging.log('RESULT', result);
		logging.groupEnd(...group);
		return result;
	});
});
export default apolloLogger;
