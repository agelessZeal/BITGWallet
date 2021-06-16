import React, { useEffect, useCallback, useState, useContext, PureComponent } from 'react';
import { View, FlatList, StyleSheet,Switch,Image, TouchableOpacity} from 'react-native';
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


import { getBITGWalletNavbarOptions } from '../UI/Navbar';


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		paddingHorizontal: 20,
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
		borderBottomColor: colors.grey050,
		borderBottomWidth: 1
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
    biometrics: {
		position: 'relative',
	},
	biometryLabel: {
		fontSize: 14,
        color: colors.green,
        textTransform:'uppercase'
		// position: 'absolute',
		// top: 0,
		// left: 0
	},
	biometrySwitch: {
		position: 'absolute',
		top: -5,
		right: 0
	},
});

const PASSCODE_NOT_SET_ERROR = 'Error: Passcode not set.';
const RESET_PASSWORD = 'reset_password';
const CONFIRM_PASSWORD = 'confirm_password';

const walletImageSource = require("../../images//bitg_wallet.png");

class SettingsScreen extends PureComponent {
	static navigationOptions = ({ navigation }) =>
		getBITGWalletNavbarOptions('app_settings.title', navigation);

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
		 * The action to update the lock time
		 * in the redux store
		 */
		setLockTime: PropTypes.func,

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
		password: '',
		confirmPassword: '',
		secureTextEntry: true,
		biometryType: null,
		biometryChoice: false,
		rememberMe: false,
		loading: false,
		error: null,
		inputWidth: { width: '99%' },
		view: RESET_PASSWORD,
		originalPassword: null,
		ready: true
	};

	async componentDidMount() {
		const biometryType = await SecureKeychain.getSupportedBiometryType();

		const state = { view: CONFIRM_PASSWORD };
		if (biometryType) {
			state.biometryType = Device.isAndroid() ? 'biometrics' : biometryType;
			state.biometryChoice = true;
		}

		this.setState(state);

		setTimeout(() => {
			this.setState({
				inputWidth: { width: '100%' }
			});
		}, 100);
	}

	componentDidUpdate(prevProps, prevState) {
		const prevLoading = prevState.loading;
		const { loading } = this.state;
		const { navigation } = this.props;
		if (!prevLoading && loading) {
			// update navigationOptions
			navigation.setParams({
				headerLeft: <View />
			});
		}
	}

	componentWillUnmount() {
		this.mounted = false;
    }
    
    manualBackup = () => {
		this.props.navigation.navigate('ManualBackupStep1');
	};

	resetPassword = () => {
		this.props.navigation.navigate('ResetPassword');
    };
    

    updateBiometryChoice = async biometryChoice => {
		if (!biometryChoice) {
			await AsyncStorage.setItem(BIOMETRY_CHOICE_DISABLED, TRUE);
		} else {
			await AsyncStorage.removeItem(BIOMETRY_CHOICE_DISABLED);
		}
		this.setState({ biometryChoice });
    };
    
	renderSwitch = () => {
		const { biometryType, rememberMe, biometryChoice } = this.state;
		return (
			<View style={styles.biometrics}>
				{biometryType ? (
					<>
						<Text style={styles.itemTitle}>
							{strings(`biometrics.enable_${biometryType.toLowerCase()}`)}
						</Text>
						<View>
							<Switch
								onValueChange={this.updateBiometryChoice} // eslint-disable-line react/jsx-no-bind
								value={biometryChoice}
								style={styles.biometrySwitch}
								trackColor={Device.isIos() ? { true: colors.green, false: colors.grey200 } : null}
								ios_backgroundColor={colors.grey200}
							/>
						</View>
					</>
				) : (
					<>
						<Text style={styles.itemTitle}>	{strings(`biometrics.enable_touchid`)}</Text>
                        <Text style={styles.itemText}>{strings('bitg_wallet.use_biometrics_description', { biometryType: "fingerprint" })}</Text>
						<Switch
							onValueChange={rememberMe => this.setState({ rememberMe })} // eslint-disable-line react/jsx-no-bind
							value={rememberMe}
							style={styles.biometrySwitch}
							trackColor={Device.isIos() ? { true: colors.green, false: colors.grey200 } : null}
							ios_backgroundColor={colors.grey200}
						/>
					</>
				)}
			</View>
		);
	};

	render() {

		return (
			<View style={styles.container}>
				<View style={styles.subMenu}>
					<MaterialIcons name="settings" size={24} color={colors.green} style={styles.icon} />
					<Text style={styles.titleText}>{strings('app_settings.general_title')}</Text>
				</View>

				<TouchableOpacity style={styles.item} onPress={this.resetPassword} >
					<Text style={styles.itemTitle}>{strings('password_reset.change_password')}</Text>
					<Text style={styles.itemText}>{strings('bitg_wallet.change_password_description')}</Text>
				</TouchableOpacity>

                <TouchableOpacity style={styles.item}>{this.renderSwitch()}</TouchableOpacity>


				<View style={styles.subMenu}>
                    <Image style={styles.icon} source={walletImageSource} />
					<Text style={styles.titleText}>{strings('drawer.wallet')}</Text>
				</View>


				<TouchableOpacity style={styles.item}>
					<Text style={styles.itemTitle}>{strings('bitg_wallet.create_wallet')}</Text>
					<Text style={styles.itemText}>{strings('onboarding.start_exploring_now')} ,add new current wallet</Text>
				</TouchableOpacity>

                <TouchableOpacity style={styles.item}>
					<Text style={styles.itemTitle}>{strings('bitg_wallet.backup_wallet')}</Text>
					<Text style={styles.itemText}>{strings('bitg_wallet.backup_wallet_description')}</Text>
				</TouchableOpacity>


				<TouchableOpacity style={styles.subMenu}>
                    <MaterialIcons name="rss-feed" size={25} color={colors.green} style={styles.icon} />
					<Text style={styles.titleText}>{strings('bitg_wallet.network')}</Text>
				</TouchableOpacity>

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
	passwordUnset: () => dispatch(passwordUnset()),
	setLockTime: time => dispatch(setLockTime(time)),
	seedphraseNotBackedUp: () => dispatch(seedphraseNotBackedUp())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsScreen);
