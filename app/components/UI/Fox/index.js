import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../../../styles/common';

const styles = StyleSheet.create({
	webView: {
		flex: 1
	},
	wrapper: {
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	image: {
		width: 100,
		height: 100
	}
});
const bitgImage = require('../../../images/bitg_logo.png'); // eslint-disable-line import/no-commonjs

/**
 * View component that displays the MetaMask fox
 * in the middle of the screen
 */


function Fox({ style, customStyle, customContent = '', forwardedRef, ...props }) {
	return (
		<View style={styles.wrapper} testID={'fox-screen'}>
			<Image source={bitgImage} style={styles.image} resizeMethod={'auto'} />
		</View>
	);
}

Fox.propTypes = {
	style: PropTypes.object,
	customStyle: PropTypes.string,
	customContent: PropTypes.string,
	forwardedRef: PropTypes.any
};

const FoxWithRef = forwardRef((props, ref) => <Fox {...props} forwardedRef={ref} />);
FoxWithRef.displayName = 'FoxWithRef';

export default FoxWithRef;
