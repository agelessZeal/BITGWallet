import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, Platform, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TouchableRipple } from 'react-native-paper';
// import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Device from '../../../util/Device';
import { renderShortAddress } from '../../../util/address';

import { getEmptyHeaderOptions, getBITGWalletNavbarOptions } from '../../UI/Navbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import QRCodeScreen from '../QRCodeScreen';

import StyledButton from '../../UI/StyledButton';

const bit_currency = require('../../../images/ic_bitg.png');

const swap_logo = require('../../../images/swap_logo.png');

const bitgImageSource = require('../../../images/ic_bitg.png');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.transparent
	},
	title: {
		fontSize: 30,
		alignSelf: 'center',
		color: colors.tintColor,
		marginTop: 20,
		marginHorizontal:20,
		textAlign:'center'
	},
	description: {
		fontSize: 16,
		alignSelf: 'center',
		color: colors.grey300,
		marginTop: 20,
		textAlign:'center'
	},
	warn: {
		fontSize: 16,
		alignSelf: 'center',
		color: colors.red900,
		marginTop: 20,
		textAlign:'center'
	},

	swapLogo: {
		resizeMode: 'contain',
		marginTop: 30
	},
	mainContent: {
		justifyContent: 'space-between',
		alignItems: 'center',
		flex:1,
		flexGrow:1,
	},
	textContent: {
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal:20,
	},

	button :{
		marginBottom:5,
		height:50,
		borderRadius:25,
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:colors.green,
		marginTop: 25,
		width:'60%'
	},
	buttonText:{
		color:colors.white,
		fontSize:16,
		fontWeight:'bold',
		textAlign:'center',
		textTransform:'uppercase'
	}
});

function ChainSwapStart({ myWalletAddress, paramsData, currentPage, navigation, clerarChildrenState ,next}) {

	const [editable, setEditable] = useState(false);

	const canSubmit = true;

	return (
		<KeyboardAwareScrollView style={{ flexGrow: 1 }} contentContainerStyle={styles.mainContent}>
				<Image style={styles.swapLogo} source={swap_logo} />

				<View style={styles.textContent}>
					<Text numberOfLines={2} style={styles.title}>{strings('bitg_wallet.chain_swap.start')} </Text>

					<Text style={styles.description}>{strings('bitg_wallet.chain_swap.start_des')} </Text>

					<Text style={styles.warn}>{strings('bitg_wallet.chain_swap.start_warn')} </Text>
				</View>

				<TouchableOpacity style={styles.button} onPress={next}>
						<Text style={styles.buttonText}>{strings('onboarding_carousel.get_started')}</Text>
				</TouchableOpacity>
		</KeyboardAwareScrollView>
	);
}

const mapStateToProps = state => ({
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	addressBook: state.engine.backgroundState.AddressBookController.addressBook,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	selectedAsset: state.transaction.selectedAsset,
	identities: state.engine.backgroundState.PreferencesController.identities,
	keyrings: state.engine.backgroundState.KeyringController.keyrings,
	ticker: state.engine.backgroundState.NetworkController.provider.ticker,
	network: state.engine.backgroundState.NetworkController.network,
	providerType: state.engine.backgroundState.NetworkController.provider.type
});

const mapDispatchToProps = dispatch => ({
	setRecipient: (from, to, ensRecipient, transactionToName, transactionFromName) =>
		dispatch(setRecipient(from, to, ensRecipient, transactionToName, transactionFromName)),
	newAssetTransaction: selectedAsset => dispatch(newAssetTransaction(selectedAsset)),
	setSelectedAsset: selectedAsset => dispatch(setSelectedAsset(selectedAsset))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChainSwapStart);
