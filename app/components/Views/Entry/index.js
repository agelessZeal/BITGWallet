import React, { useState, useRef, useEffect, useCallback } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Engine from '../../../core/Engine';
import LottieView from 'lottie-react-native';
import SecureKeychain from '../../../core/SecureKeychain';
import setOnboardingWizardStep from '../../../actions/wizard';
import { connect } from 'react-redux';
import { colors } from '../../../styles/common';
import Logger from '../../../util/Logger';
import Device from '../../../util/Device';
import { recreateVaultWithSamePassword } from '../../../core/Vault';
import {setPolkaApi}  from '../../../actions/api'
import {
	EXISTING_USER,
	ONBOARDING_WIZARD,
	METRICS_OPT_IN,
	ENCRYPTION_LIB,
	ORIGINAL,
	CURRENT_APP_VERSION,
	LAST_APP_VERSION
} from '../../../constants/storage';
import { getVersion } from 'react-native-device-info';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { Keyring } from '@polkadot/keyring';

// imports we are using here
import { u8aToHex } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToMiniSecret, randomAsHex } from '@polkadot/util-crypto';


/**
 * Entry Screen that decides which screen to show
 * depending on the state of the user
 * new, existing , logged in or not
 * while showing the fox
 */
const LOGO_SIZE = 175;
const LOGO_PADDING = 25;
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: colors.white
	},
	metamaskName: {
		marginTop: 10,
		height: 25,
		width: 170,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	logoWrapper: {
		backgroundColor: colors.white,
		paddingTop: 50,
		marginTop: Dimensions.get('window').height / 2 - LOGO_SIZE / 2 - LOGO_PADDING,
		height: LOGO_SIZE + LOGO_PADDING * 2
	},
	foxAndName: {
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	animation: {
		width: 110,
		height: 110,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	fox: {
		width: 110,
		height: 110,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

const Entry = props => {
	const [viewToGo, setViewToGo] = useState(null);

	const animation = useRef(null);
	const animationName = useRef(null);
	const opacity = useRef(new Animated.Value(1)).current;

	const onAnimationFinished = useCallback(() => {
		Animated.timing(opacity, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
			isInteraction: false
		}).start(() => {
			if (viewToGo && (viewToGo !== 'WalletView' || viewToGo !== 'Onboarding')) {
				props.navigation.navigate(viewToGo);
			} else if (viewToGo === 'Onboarding') {
				props.navigation.navigate('OnboardingRootNav');
			} else {
				props.navigation.navigate('HomeNav');
			}
		});
	}, [opacity, viewToGo, props.navigation]);

	const animateAndGoTo = useCallback(
		viewToGo => {
			setViewToGo(viewToGo);
			if (Device.isAndroid()) {
				animation && animation.current ? animation.current.play(0, 25) : onAnimationFinished();
				// animationName && animationName.current && animationName.current.play();
			} else {
				animation && animation.current && animation.current.play();
				// animation && animation.current && animationName.current.play();
			}
		},
		[onAnimationFinished]
	);

	const unlockKeychain = useCallback(async () => {
		try {
			// Retreive the credentials
			const { KeyringController } = Engine.context;
			const credentials = await SecureKeychain.getGenericPassword();
			if (credentials) {
				// Restore vault with existing credentials

				await KeyringController.submitPassword(credentials.password);
				const encryptionLib = await AsyncStorage.getItem(ENCRYPTION_LIB);
				if (encryptionLib !== ORIGINAL) {
					await recreateVaultWithSamePassword(credentials.password, props.selectedAddress);
					await AsyncStorage.setItem(ENCRYPTION_LIB, ORIGINAL);
				}
				// Get onboarding wizard state
				const onboardingWizard = await AsyncStorage.getItem(ONBOARDING_WIZARD);
				// Check if user passed through metrics opt-in screen
				// const metricsOptIn = await AsyncStorage.getItem(METRICS_OPT_IN);
				const metricsOptIn =  true;
				if (!metricsOptIn) {
					animateAndGoTo('OptinMetrics');
				} else if (onboardingWizard) {
					animateAndGoTo('HomeNav');
				} else {
					props.setOnboardingWizardStep(1);
					animateAndGoTo('WalletView');
				}
			} else if (props.passwordSet) {
				animateAndGoTo('Login');
			} else {
				await KeyringController.submitPassword('');
				await SecureKeychain.resetGenericPassword();
				props.navigation.navigate('HomeNav');
			}
		} catch (error) {
			Logger.log(`Keychain couldn't be accessed`, error);
			animateAndGoTo('Login');
		}
	}, [animateAndGoTo, props]);

	useEffect(() => {
		async function startApp() {
			const existingUser = await AsyncStorage.getItem(EXISTING_USER);
			try {
				const currentVersion = await getVersion();
				const savedVersion = await AsyncStorage.getItem(CURRENT_APP_VERSION);
				if (currentVersion !== savedVersion) {
					if (savedVersion) await AsyncStorage.setItem(LAST_APP_VERSION, savedVersion);
					await AsyncStorage.setItem(CURRENT_APP_VERSION, currentVersion);
				}

				const lastVersion = await AsyncStorage.getItem(LAST_APP_VERSION);
				if (!lastVersion) {
					if (existingUser) {
						// Setting last version to first version if user exists and lastVersion does not, to simulate update
						await AsyncStorage.setItem(LAST_APP_VERSION, '0.0.1');
					} else {
						// Setting last version to current version so that it's not treated as an update
						await AsyncStorage.setItem(LAST_APP_VERSION, currentVersion);
					}
				}
			} catch (error) {
				Logger.error(error);
			}

			if (existingUser !== null) {
				unlockKeychain();
			} else {
				animateAndGoTo('OnboardingRootNav');
			}
		}

		startApp();

		initializePolkaWalletConnect()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const initializePolkaWalletConnect = async () => {

		console.log('polka iniit in entry:')

		// Construct
		const wsProvider = new WsProvider('wss://testnet.bitg.org');
		const api = await ApiPromise.create({  types: {
			"CallOf": "Call",
			"DispatchTime": {
				"_enum": {
					"At": "BlockNumber",
					"After": "BlockNumber"
				}
			},
			"ScheduleTaskIndex": "u32",
			"DelayedOrigin": {
				"delay": "BlockNumber",
				"origin": "PalletsOrigin"
			},
			"StorageValue": "Vec<u8>",
			"GraduallyUpdate": {
				"key": "StorageKey",
				"targetValue": "StorageValue",
				"perBlock": "StorageValue"
			},
			"StorageKeyBytes": "Vec<u8>",
			"StorageValueBytes": "Vec<u8>",
			"RpcDataProviderId": "Text",
			"OrderedSet": "Vec<AccountId>",
			"OrmlAccountData": {
				"free": "Balance",
				"frozen": "Balance",
				"reserved": "Balance"
			},
			"OrmlBalanceLock": {
				"amount": "Balance",
				"id": "LockIdentifier"
			},
			"DelayedDispatchTime": {
				"_enum": {
					"At": "BlockNumber",
					"After": "BlockNumber"
				}
			},
			"DispatchId": "u32",
			"Price": "FixedU128",
			"OrmlVestingSchedule": {
				"start": "BlockNumber",
				"period": "BlockNumber",
				"periodCount": "u32",
				"perPeriod": "Compact<Balance>"
			},
			"VestingScheduleOf": "OrmlVestingSchedule",
			"PalletBalanceOf": "Balance",
			"ChangeBalance": {
				"_enum": {
					"NoChange": "Null",
					"NewValue": "Balance"
				}
			},
			"BalanceWrapper": {
				"amount": "Balance"
			},
			"BalanceRequest": {
				"amount": "Balance"
			},
			"EvmAccountInfo": {
				"nonce": "Index",
				"contractInfo": "Option<EvmContractInfo>",
				"developerDeposit": "Option<Balance>"
			},
			"CodeInfo": {
				"codeSize": "u32",
				"refCount": "u32"
			},
			"EvmContractInfo": {
				"codeHash": "H256",
				"maintainer": "H160",
				"deployed": "bool"
			},
			"EvmAddress": "H160",
			"CallRequest": {
				"from": "Option<H160>",
				"to": "Option<H160>",
				"gasLimit": "Option<u32>",
				"storageLimit": "Option<u32>",
				"value": "Option<U128>",
				"data": "Option<Bytes>"
			},
			"CID": "Vec<u8>",
			"ClassId": "u32",
			"ClassIdOf": "ClassId",
			"TokenId": "u64",
			"TokenIdOf": "TokenId",
			"TokenInfoOf": {
				"metadata": "CID",
				"owner": "AccountId",
				"data": "TokenData"
			},
			"TokenData": {
				"deposit": "Balance"
			},
			"Properties": {
				"_set": {
					"_bitLength": 8,
					"Transferable": 1,
					"Burnable": 2
				}
			},
			"BondingLedger": {
				"total": "Compact<Balance>",
				"active": "Compact<Balance>",
				"unlocking": "Vec<UnlockChunk>"
			},
			"Amount": "i128",
			"AmountOf": "Amount",
			"AuctionId": "u32",
			"AuctionIdOf": "AuctionId",
			"TokenSymbol": {
				"_enum": {
					"BITG": 0,
					"USDG": 1
				}
			},
			"CurrencyId": {
				"_enum": {
					"Token": "TokenSymbol",
					"DEXShare": "(TokenSymbol, TokenSymbol)",
					"ERC20": "EvmAddress"
				}
			},
			"CurrencyIdOf": "CurrencyId",
			"AuthoritysOriginId": {
				"_enum": [
					"Root"
				]
			},
			"TradingPair": "(CurrencyId,  CurrencyId)",
			"AsOriginId": "AuthoritysOriginId",
			"SubAccountStatus": {
				"bonded": "Balance",
				"available": "Balance",
				"unbonding": "Vec<(EraIndex,Balance)>",
				"mockRewardRate": "Rate"
			},
			"Params": {
				"targetMaxFreeUnbondedRatio": "Ratio",
				"targetMinFreeUnbondedRatio": "Ratio",
				"targetUnbondingToFreeRatio": "Ratio",
				"unbondingToFreeAdjustment": "Ratio",
				"baseFeeRate": "Rate"
			},
			"Ledger": {
				"bonded": "Balance",
				"unbondingToFree": "Balance",
				"freePool": "Balance",
				"toUnbondNextEra": "(Balance, Balance)"
			},
			"ChangeRate": {
				"_enum": {
					"NoChange": "Null",
					"NewValue": "Rate"
				}
			},
			"ChangeRatio": {
				"_enum": {
					"NoChange": "Null",
					"NewValue": "Ratio"
				}
			},
			"BalanceInfo": {
				"amount": "Balance"
			},
			"Rate": "FixedU128",
			"Ratio": "FixedU128",
			"PublicKey": "[u8; 20]",
			"DestAddress": "Vec<u8>",
			"Keys": "SessionKeys2",
			"PalletsOrigin": {
				"_enum": {
					"System": "SystemOrigin",
					"Timestamp": "Null",
					"RandomnessCollectiveFlip": "Null",
					"Balances": "Null",
					"Accounts": "Null",
					"Currencies": "Null",
					"Tokens": "Null",
					"Vesting": "Null",
					"Utility": "Null",
					"Multisig": "Null",
					"Recovery": "Null",
					"Proxy": "Null",
					"Scheduler": "Null",
					"Indices": "Null",
					"GraduallyUpdate": "Null",
					"Authorship": "Null",
					"Babe": "Null",
					"Grandpa": "Null",
					"Staking": "Null",
					"Session": "Null",
					"Historical": "Null",
					"Authority": "DelayedOrigin",
					"ElectionsPhragmen": "Null",
					"Contracts": "Null",
					"EVM": "Null",
					"Sudo": "Null",
					"TransactionPayment": "Null"
				}
			},
			"LockState": {
				"_enum": {
					"Committed": "None",
					"Unbonding": "BlockNumber"
				}
			},
			"LockDuration": {
				"_enum": [
					"OneMonth",
					"OneYear",
					"TenYears"
				]
			},
			"EraIndex": "u32",
			"Era": {
				"index": "EraIndex",
				"start": "BlockNumber"
			},
			"Commitment": {
				"state": "LockState",
				"duration": "LockDuration",
				"amount": "Balance",
				"candidate": "AccountId"
			}
		},  provider: wsProvider });

		// Do something
		console.log("genesisHash:",api.genesisHash.toHex());
		// The length of an epoch (session) in Babe
		console.log(api.consts.babe.epochDuration.toNumber());

		props.setPolkaApi(api);

		const MNEMONIC = 'sample split bamboo west visual approve brain fox arch impact relief smile';

		// type: ed25519, ssFormat: 42 (all defaults)
		const keyring = new Keyring();
		const pair = keyring.createFromUri(MNEMONIC);

		// use the default as setup on init
		// 5CSbZ7wG456oty4WoiX6a1J88VUbrCXLhrKVJ9q95BsYH4TZ
		console.log('Substrate generic:', pair.address);


		// our ed25519 pairs
		// console.log(keyring.createFromUri(MNEMONIC).address);
		// console.log(keyring.createFromUri(`${MNEMONIC}//hardA//hardB`).address);
		// console.log(keyring.createFromUri(`${MNEMONIC}//hard///password`).address);


		// // generate a mnemonic & some mini-secrets
		// const mnemonic = mnemonicGenerate();
		// const mnemonicMini = mnemonicToMiniSecret(mnemonic);
		// const randomMini = randomAsHex(32);

		// // these will be equivalent
		// console.log(keyring.createFromUri(mnemonic).address);
		// console.log(keyring.createFromUri(u8aToHex(mnemonicMini)).address);

		// // a random seed with derivation applied
		// console.log(keyring.createFromUri(`${randomMini}//hard`).address);


		// // Retrieve the chain name
		// const chain = await api.rpc.system.chain();

		// // Retrieve the latest header
		// const lastHeader = await api.rpc.chain.getHeader();

		// Log the information
		// console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);


		  // Retrieve the initial balance. Since the call has no callback, it is simply a promise
		// that resolves to the current on-chain value

		// Known account we want to use (available on dev chain, with funds)



		// const Alice = keyring.createFromUri('//Alice').address;

		// console.log('Alice Address:',Alice);

		// let { data: { free }, nonce } = await api.query.system.account(pair.address);

		// console.log(`${pair.address} has a balance of ${free}, nonce ${nonce}`);

		// console.log(`You may leave this example running and start example 06 or transfer any value to ${pair.address}`);
		
		// // The amount required to create a new account
		// console.log(api.consts.balances.existentialDeposit.toNumber());
		
		// // The amount required per byte on an extrinsic
		// console.log(api.consts.transactionPayment.transactionByteFee.toNumber());

	};
	const renderAnimations = () => {
		if (!viewToGo) {
			return <LottieView style={styles.animation} autoPlay source={require('../../../animations/animation_center.json')} />;
		}

		return (
			<View style={styles.foxAndName}>
				<LottieView
					ref={animation}
					style={styles.animation}
					loop={false}
					source={require('../../../animations/animation_center.json')}
					onAnimationFinish={onAnimationFinished}
				/>
				{/* <LottieView
					ref={animationName}
					style={styles.metamaskName}
					loop={false}
					source={require('../../../animations/animation_conner.json')}
				/> */}
			</View>
		);
	};

	return (
		<View style={styles.main}>
			<Animated.View style={[styles.logoWrapper, { opacity }]}>
				<View style={styles.fox}>{renderAnimations()}</View>
			</Animated.View>
		</View>
	);
};

Entry.propTypes = {
	/**
	/* navigation object required to push new views
	*/
	navigation: PropTypes.object,
	/**
	 * A string that represents the selected address
	 */
	selectedAddress: PropTypes.string,
	/**
	 * Boolean that determines if the user has set a password before
	 */
	passwordSet: PropTypes.bool,
	/**
	 * Dispatch set onboarding wizard step
	 */
	setOnboardingWizardStep: PropTypes.func,

	setPolkaApi: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
	setOnboardingWizardStep: step => dispatch(setOnboardingWizardStep(step)),
	setPolkaApi: api => dispatch(setPolkaApi(api))
});

const mapStateToProps = state => ({
	passwordSet: state.user.passwordSet,
	selectedAddress:
		state.engine.backgroundState.PreferencesController &&
		state.engine.backgroundState.PreferencesController.selectedAddress
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withNavigation(Entry));
