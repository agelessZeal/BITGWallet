import React, { useEffect, useCallback, useState, useContext, PureComponent } from 'react';
import { View, FlatList, StyleSheet,Switch,Image, TouchableOpacity,	TextInput} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SecureKeychain from '../../core/SecureKeychain';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppConstants from '../../core/AppConstants';
import Device from '../../util/Device';
import { passwordSet, passwordUnset, seedphraseNotBackedUp } from '../../actions/user';
import { setLockTime } from '../../actions/settings';

import StyledButton from '../UI/StyledButton';
import { getBITGWalletNavbarOptions ,getNavigationOptionsTitle} from '../UI/Navbar';


const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.white,
		paddingHorizontal: 20,
		flexGrow:1,
		flex:1,
	},
	subMenu: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	titleText: {
		color: colors.green,
		fontSize: 16,
        marginStart: 10,
	},
	item: {
		marginLeft: 10,
		marginTop: 20,
		paddingBottom: 20,
		alignSelf: 'stretch',
		justifyContent: 'flex-start',
	},
	itemTitle: {
		color: colors.green,
        fontSize: 16,
        textTransform:'uppercase'
	},
	itemText: {
		marginTop: 10,
		color: colors.grey500,
		fontSize: 12
	},
	icon: {
		width: 22,
		height: 22
	},
	field: {
		position: 'relative'
	},
	input: {
		borderWidth: 1,
		borderColor: colors.grey500,
		padding: 10,
		borderRadius: 6,
		fontSize: 14,
		height: 50,
		...fontStyles.normal
	},
	hintLabel: {
		height: 20,
		marginTop: 14,
		fontSize: 12,
		color: colors.grey450,
		textAlign: 'left',
		...fontStyles.normal
	},
	showInputCheck: {
		position: 'absolute',
		top: 50,
		right: 17,
		alignSelf: 'flex-end'
	},
	ctaWrapper: {
		flex: 1,
		flexGrow:1,
		marginTop: 20,
		paddingHorizontal: 10
	},

});


const walletImageSource = require("../../images//bitg_wallet.png");

class NetworkIDSetting extends PureComponent {

	static navigationOptions = ({ navigation }) =>
	getNavigationOptionsTitle(strings('bitg_wallet.network_id'), navigation);


	static propTypes = {
		/**
		 * The navigator object
		 */
		navigation: PropTypes.object,
		/**
		 * The action to update the password set flag
		 * in the redux store
		 */
		passwordSet: PropTypes.func,

		/**
		 * Map of accounts to information objects including balances
		 */
		accounts: PropTypes.object,
		/**
		 * A string that represents the selected address
		 */
		selectedAddress: PropTypes.string,
		/**
		 * An object containing token balances for current account and network in the format address => balance
		 */
		balances: PropTypes.object,
		/**
		 * ETH to current currency conversion rate
		 */
		conversionRate: PropTypes.number,
		/**
		 * Currency code of the currently-active currency
		 */
		currentCurrency: PropTypes.string,
		/**
		 * An object containing token exchange rates in the format address => exchangeRate
		 */
		tokenExchangeRates: PropTypes.object
	};

	state = {
		isSelected: false,
		networkId: '',
		loading: false,
		error: null,
		inputWidth: { width: '99%' },

		ready: true
	};

	async componentDidMount() {

		setTimeout(() => {
			this.setState({
				inputWidth: { width: '100%' }
			});
		}, 100);
	}

	componentDidUpdate(prevProps, prevState) {

	}

	componentWillUnmount() {

	}

	onPressSave = async () => {

	}
	
	setNetworkId = val => this.setState({ networkId: val });
	

	render() {

		const {
			isSelected,
			inputWidth,
			networkId,
			error,
			loading
		} = this.state;

		const correctInputed = networkId !== '';
		const canSubmit = correctInputed;

		return (
			<View style={styles.container}>
				<View style={styles.item}>
					<Text style={styles.itemTitle}>{strings('transaction.set_gas')} {strings('bitg_wallet.network_id')}</Text>
					<View style={styles.field}>
						<Text style={styles.hintLabel}> {strings('app_settings.network_name_label')}</Text>
						<TextInput
							style={[styles.input, inputWidth]}
							value={networkId}
							onChangeText={this.setNetworkId}
							secureTextEntry={false}
							placeholder={''}
							placeholderTextColor={colors.grey100}
							testID={'input-password-confirm'}
							onSubmitEditing={this.onPressSave}
							returnKeyType={'done'}
							autoCapitalize="none"
						/>
						<View style={styles.showInputCheck}>
							{correctInputed ? (
								<Icon name="check" size={16} color={colors.green} />
							) : null}
						</View>
					</View>
				</View>

				<View style={styles.ctaWrapper}>
					<StyledButton
						type={'blue'}
						onPress={this.onPressCreate}
						testID={'submit-button'}
						disabled={!canSubmit}
					>
						{strings('app_settings.network_save')}
					</StyledButton>
				</View>

			</View>
		);
	}
}

const mapStateToProps = state => ({
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
	conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
	tokenExchangeRates: state.engine.backgroundState.TokenRatesController.contractExchangeRates,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency
});

const mapDispatchToProps = dispatch => ({
	passwordSet: () => dispatch(passwordSet()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NetworkIDSetting);
