import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Browser from '../../Views/Browser';
import AddBookmark from '../../Views/AddBookmark';
import SimpleWebview from '../../Views/SimpleWebview';
import Approval from '../../Views/Approval';
import Settings from '../../Views/Settings';
import GeneralSettings from '../../Views/Settings/GeneralSettings';
import AdvancedSettings from '../../Views/Settings/AdvancedSettings';
import SecuritySettings from '../../Views/Settings/SecuritySettings';
import ExperimentalSettings from '../../Views/Settings/ExperimentalSettings';
import NetworksSettings from '../../Views/Settings/NetworksSettings';
import NetworkSettings from '../../Views/Settings/NetworksSettings/NetworkSettings';
import AppInformation from '../../Views/Settings/AppInformation';
import Contacts from '../../Views/Settings/Contacts';
import Wallet from '../../Views/Wallet';
import Asset from '../../Views/Asset';
import AddAsset from '../../Views/AddAsset';
import Collectible from '../../Views/Collectible';
import Send from '../../Views/Send';
import SendTo from '../../Views/SendFlow/SendTo';
import RevealPrivateCredential from '../../Views/RevealPrivateCredential';
import WalletConnectSessions from '../../Views/WalletConnectSessions';
import OfflineMode from '../../Views/OfflineMode';
import QrScanner from '../../Views/QRScanner';
import LockScreen from '../../Views/LockScreen';
import ChoosePasswordSimple from '../../Views/ChoosePasswordSimple';
import EnterPasswordSimple from '../../Views/EnterPasswordSimple';
import ChoosePassword from '../../Views/ChoosePassword';
import ResetPassword from '../../Views/ResetPassword';
import AccountBackupStep1 from '../../Views/AccountBackupStep1';
import AccountBackupStep1B from '../../Views/AccountBackupStep1B';
import ManualBackupStep1 from '../../Views/ManualBackupStep1';
import ManualBackupStep2 from '../../Views/ManualBackupStep2';
import ManualBackupStep3 from '../../Views/ManualBackupStep3';
import ImportPrivateKey from '../../Views/ImportPrivateKey';
import ImportPrivateKeySuccess from '../../Views/ImportPrivateKeySuccess';
import PaymentRequest from '../../UI/PaymentRequest';
import PaymentRequestSuccess from '../../UI/PaymentRequestSuccess';
import Approve from '../../Views/ApproveView/Approve';
import Amount from '../../Views/SendFlow/Amount';
import Confirm from '../../Views/SendFlow/Confirm';
import ContactForm from '../../Views/Settings/Contacts/ContactForm';
import PaymentMethodSelector from '../../UI/FiatOrders/PaymentMethodSelector';
import PaymentMethodApplePay from '../../UI/FiatOrders/PaymentMethodApplePay';
import TransakWebView from '../../UI/FiatOrders/TransakWebView';
import ActivityView from '../../Views/ActivityView';
import SwapsAmountView from '../../UI/Swaps';
import SwapsQuotesView from '../../UI/Swaps/QuotesView';
import { colors } from '../../../styles/common';
import MyWalletScreen from '../../BITG/MyWalletScreen';
import MyImpactSignup from "../../BITG/MyImpactSignup";
import MyImpactDash from '../../BITG/MyImpactDash'

import ImpactInitiativesScreen from '../../BITG/ImpactInitiativesScreen'
import ShopScreen from '../../BITG/ShopScreen'
import NewsScreen from '../../BITG/NewsScreen'
import SendScreen from '../../BITG/send/SendScreen'
import ReceiveScreen  from '../../BITG/ReceiveScreen';
import SettingsScreen from '../../BITG/SettingsScreen';
import NetworkIDSetting from '../../BITG/NetworkIDSetting'
import ImpactActivityDetail from '../../BITG/ImpactActivityDetail'
import ImpactHistory from '../../BITG/ImpactHistory'
import InitiativeDetailScreen from '../../BITG/InitiativeDetailScreen'

import AddressBookScreen from '../../BITG/AddressBookScreen'
import AddressDetailScreen from '../../BITG/AddressDetailScreen'
import AddressNewScreen from '../../BITG/AddressNewScreen'

import ActionScreen from '../../BITG/ActionScreen'
import ServicesScreen from '../../BITG/ServicesScreen'
import ServiceScreen from '../../BITG/ServiceScreen'
import GasEducationCarousel from '../../Views/GasEducationCarousel';

import TransactionHistory from '../../BITG/Transactions'
import TransactionDetail from '../../BITG/TransactionDetail'

import ChainSwapScreen from '../../BITG/swap/ChainSwapScreen'


const tabImages = {
	wallet: require('../../../images/ic_bitg.png'),
	star: require('../../../images/ic_stars.png'),
	store: require('../../../images/ic_store_mall.png'),
	send: require('../../../images/ic_send.png'),
	dash: require('../../../images/ic_dashboard.png'),
	carousel: null
};

const styles = StyleSheet.create({
	headerLogo: {
		width: 125,
		height: 50
	},
	tabIcon: {
		width: 30,
		height: 30,
		resizeMode: 'contain'
	},
	badgeWrapper: {
		position: 'absolute',
		top: -5,
		right: -5,
		backgroundColor: colors.red900,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		height: 16,
		width: 16
	},
	badgeText: {
		fontSize: 15,
		color: colors.white
	}
});

const getNavigationOption = (navigation, type) => {
	let badgeNumber = 0;
	if (type === 'star') {
		badgeNumber = 1;
	}

	return {
		title: '',
		tabBarIcon: ({ focused }) => (
			<View>
				<Image
					source={tabImages[type]}
					style={[styles.tabIcon, { tintColor: focused ? colors.green : colors.grey200 }]}
				/>
				{badgeNumber > 0 ? (
					<View style={styles.badgeWrapper}>
						<Text style={styles.badgeText}>{badgeNumber}</Text>
					</View>
				) : null}
			</View>
		),
		tabBarBadge: false
	};
};

/**
 * Navigator component that wraps
 * the 2 main sections: Browser, Wallet
 */

export default createStackNavigator(
	{
		Home: {
			screen: createMaterialBottomTabNavigator(
				{
					WalletTabHome: createStackNavigator(
						{
							WalletView: {
								screen: MyWalletScreen
							},
							ChainSwap: {
								screen: ChainSwapScreen,
							},
							WalletView2: {
								screen: Wallet
							},
							Asset: {
								screen: Asset
							},
							AddAsset: {
								screen: AddAsset
							},
							Collectible: {
								screen: Collectible
							},
							// CollectibleView: {
							// 	screen: CollectibleView
							// },
							RevealPrivateCredentialView: {
								screen: RevealPrivateCredential
							}
						},
						{
							navigationOptions: ({ navigation }) => getNavigationOption(navigation, 'wallet')
						}
					),
					MyImpactTabHome: createStackNavigator(
						{
							MyImpactSignup: {
								screen: MyImpactSignup,
								navigationOptions: {
									gesturesEnabled: false
								}
							},
							MyImpactDash: {
								screen: MyImpactDash,
							},
							ImpactActivityDetail:{
								screen:ImpactActivityDetail
							},
							ImpactHistory:{
								screen:ImpactHistory
							},
							ImpactInitiativesScreen:{
								screen:ImpactInitiativesScreen
							},
							InitiativeDetail:{
								screen:InitiativeDetailScreen
							},
							ActionScreen : {
								screen:ActionScreen
							},
							ServicesScreen: {
								screen: ServicesScreen
							},
							ServiceScreen: {
								screen: ServiceScreen
							}
						},
						{
							navigationOptions: ({ navigation }) => getNavigationOption(navigation, 'star')
						}
					),
					StoreTabHome: createStackNavigator(
						{
							ShopScreen: {
								screen: ShopScreen
							}
						},
						{
							navigationOptions: ({ navigation }) => getNavigationOption(navigation, 'store')
						}
					),

					SendTabHome: createStackNavigator(
						{
							SendView: {
								screen:  SendScreen,
								navigationOptions: {
									gesturesEnabled: false
								}
							},
						},
						{
							navigationOptions: ({ navigation }) => getNavigationOption(navigation, 'send')
						}
					),
					NewsHomw: createStackNavigator(
						{
							NewsScreen: {
								screen:  NewsScreen
							}
						},
						{
							navigationOptions: ({ navigation }) => getNavigationOption(navigation, 'dash')
						}
					),
				},
				{
					defaultNavigationOptions: () => ({
						tabBarVisible: true
					}),
					showLable:false,
					activeColor: colors.green,
					inactiveColor: colors.green,
					barStyle: { backgroundColor: colors.grey000 },
					adaptive:false,
					shifting:false,
					labeled:false

				}
			)
		},
		AddressBookTabHome:{
			screen:createStackNavigator(
				{
					AddressBook: {
						screen: AddressBookScreen,
						navigationOptions: {
							gesturesEnabled: false
						}
					},
					AddressDetail :{
						screen: AddressDetailScreen
					},
					AddressNewScreen:{
						screen: AddressNewScreen
					}
				},
			),
		},

		BrowserTabHome:{
			screen:createStackNavigator(
				{
					BrowserView: {
						screen: Browser,
						navigationOptions: {
							gesturesEnabled: false
						}
					}
				},
			),
		},
		TransactionsHome:{
			screen:createStackNavigator(
				{
					TransactionHistory: {
						screen:TransactionHistory
					},
					TransactionDetail: {
						screen:TransactionDetail
					},
					TransactionsView: {
						screen: ActivityView
					}
				},
				{
					defaultNavigationOptions: () => ({
						tabBarVisible: false
					})
				}
			)
		},
		Webview: {
			screen: createStackNavigator(
				{
					SimpleWebview: {
						screen: SimpleWebview
					}
				},
				{
					mode: 'modal'
				}
			)
		},
		SettingsView: {
			screen: createStackNavigator({
				SettingsScreen:{
					screen: SettingsScreen
				},
				Settings: {
					screen: Settings
				},
				GeneralSettings: {
					screen: GeneralSettings
				},
				AdvancedSettings: {
					screen: AdvancedSettings
				},
				SecuritySettings: {
					screen: SecuritySettings
				},
				ExperimentalSettings: {
					screen: ExperimentalSettings
				},
				NetworksSettings: {
					screen: NetworksSettings
				},
				NetworkSettings: {
					screen: NetworkSettings
				},
				CompanySettings: {
					screen: AppInformation
				},
				ContactsSettings: {
					screen: Contacts
				},
				ContactForm: {
					screen: ContactForm
				},
				RevealPrivateCredentialView: {
					screen: RevealPrivateCredential
				},
				WalletConnectSessionsView: {
					screen: WalletConnectSessions
				},
				ChoosePasswordSimple: {
					screen: ChoosePasswordSimple
				},
				ResetPassword: {
					screen: ResetPassword
				},
				ManualBackupStep1: {
					screen: ManualBackupStep1
				},
				ManualBackupStep2: {
					screen: ManualBackupStep2
				},
				ManualBackupStep3: {
					screen: ManualBackupStep3
				},
				EnterPasswordSimple: {
					screen: EnterPasswordSimple
				},
				NetworkIDSetting :{
					screen:NetworkIDSetting 
				}
			})
		},
		ImportPrivateKeyView: {
			screen: createStackNavigator(
				{
					ImportPrivateKey: {
						screen: ImportPrivateKey
					},
					ImportPrivateKeySuccess: {
						screen: ImportPrivateKeySuccess
					}
				},
				{
					headerMode: 'none'
				}
			)
		},
		ReceiveScreenView: {
			screen: createStackNavigator({
				ReceiveScreen: {
					screen: ReceiveScreen
				}
			})
		},
		SendView: {
			screen: createStackNavigator({
				Send: {
					screen: Send
				}
			})
		},
		SendFlowView: {
			screen: createStackNavigator({
				SendTo: {
					screen: SendTo
				},
				Amount: {
					screen: Amount
				},
				Confirm: {
					screen: Confirm
				}
			})
		},
		ApprovalView: {
			screen: createStackNavigator({
				Approval: {
					screen: Approval
				}
			})
		},
		ApproveView: {
			screen: createStackNavigator({
				Approve: {
					screen: Approve
				}
			})
		},
		AddBookmarkView: {
			screen: createStackNavigator({
				AddBookmark: {
					screen: AddBookmark
				}
			})
		},
		OfflineModeView: {
			screen: createStackNavigator({
				OfflineMode: {
					screen: OfflineMode
				}
			})
		},
		/** ALL FULL SCREEN MODALS SHOULD GO HERE */
		QRScanner: {
			screen: QrScanner
		},
		LockScreen: {
			screen: LockScreen
		},
		PaymentRequestView: {
			screen: createStackNavigator(
				{
					PaymentRequest: {
						screen: PaymentRequest
					},
					PaymentRequestSuccess: {
						screen: PaymentRequestSuccess
					}
				},
				{
					mode: 'modal'
				}
			)
		},
		FiatOnRamp: {
			screen: createStackNavigator({
				PaymentMethodSelector: { screen: PaymentMethodSelector },
				PaymentMethodApplePay: { screen: PaymentMethodApplePay },
				TransakFlow: { screen: TransakWebView },
				GasEducationCarousel: { screen: GasEducationCarousel }
			})
		},
		Swaps: {
			screen: createStackNavigator({
				SwapsAmountView: { screen: SwapsAmountView },
				SwapsQuotesView: { screen: SwapsQuotesView }
			})
		},
		SetPasswordFlow: {
			screen: createStackNavigator(
				{
					ChoosePassword: {
						screen: ChoosePassword
					},
					AccountBackupStep1: {
						screen: AccountBackupStep1
					},
					AccountBackupStep1B: {
						screen: AccountBackupStep1B
					},
					ManualBackupStep1: {
						screen: ManualBackupStep1
					},
					ManualBackupStep2: {
						screen: ManualBackupStep2
					},
					ManualBackupStep3: {
						screen: ManualBackupStep3
					}
				},
				{
					defaultNavigationOptions: {
						// eslint-disable-next-line
						headerTitle: () => (
							<View />
							// <Image
							// 	style={styles.headerLogo}
							// 	source={require('../../../images/bitg_name.png')}
							// 	resizeMode={'contain'}
							// />
						),
						headerStyle: {
							borderBottomWidth: 0
						}
					}
				}
			)
		}
	},
	{
		mode: 'modal',
		headerMode: 'none',
		lazy: true
	}
);
