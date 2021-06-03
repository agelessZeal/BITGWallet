import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { colors } from '../../../styles/common';
import Device from '../../../util/Device';

const styles = StyleSheet.create({
	flex: {
		flex: 1,
		backgroundColor: colors.white
	},
	wrapper: {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		position: 'absolute',
		paddingTop: Device.isIphoneX() ? 90 : 50,
		borderTopWidth: 0,
		borderColor: colors.white,
		backgroundColor: colors.white,
		flex: 1,
		width: null,
		height: null
	}
});

const images = {
	a: require('../../../images/Start.png'),
	b: require('../../../images/Start.png'),
	c: require('../../../images/Start.png'),
	d: require('../../../images/Start.png'),
	e: require('../../../images/Unlock.png'),
	carousel: null
};

const OnboardingScreenWithBg = props => (
	<View style={styles.flex}>
		<ImageBackground source={images[props.screen]} style={styles.wrapper} resizeMode={'stretch'}>
			{props.children}
		</ImageBackground>
	</View>
);

OnboardingScreenWithBg.propTypes = {
	/**
	 * String specifying the image
	 * to be used
	 */
	screen: PropTypes.string,
	/**
	 * Children components of the GenericButton
	 * it can be a text node, an image, or an icon
	 * or an Array with a combination of them
	 */
	children: PropTypes.any
};

export default OnboardingScreenWithBg;
