import React, { useEffect, useCallback, useState, useContext } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { getEmptyHeaderOptions } from '../UI/Navbar';

import { NavigationContext } from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showAlert } from './lib/Helpers';

import ToolBar from './ToolBar';

import { GET_ARTICLES } from './api/queries/user';
import { createApolloClient } from './api/createApolloClient';
import {isValidAddressPolkadotAddress} from '../../util/address'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	headerContainer: {
		backgroundColor: colors.darkTintColor,
		justifyContent: 'center',
		alignItems: 'center',
		height: 200,
		marginBottom: 30,
	},
	titleText: {
		fontSize: 30,
		marginTop: 20,
		color: colors.white
	},
	subTitleText: {
		fontSize: 16,
		color: colors.white
	},
	inputContainer: {
		margin: 30
	},
	inputTextTitle: {
		fontSize: 16,
		color: colors.tintColor,
		textTransform: 'uppercase'
	},
	text: {
		fontSize: 14,
		marginTop: 5,
		color: colors.grey500
	},
	input: {
		height: 50,
		alignSelf: 'stretch',
		backgroundColor: colors.light_gray,
		fontSize: 16,
		padding: 10,
		color: colors.blackColor,
		flexDirection: 'row',
		alignItems: 'center'
	},
	selectWrapper: {
		flex: 1,
		backgroundColor: colors.light_gray,
		paddingHorizontal: 10,
		minHeight: 52,
		flexDirection: 'row',
		marginVertical: 8
	},

	inputWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	textInput: {
		...fontStyles.normal,
		paddingLeft: 0,
		paddingRight: 8,
		width: '100%'
	},
	submitButton: {
		height: 50,
		borderRadius: 25,
		alignSelf: 'center',
		backgroundColor: colors.tintColor,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 50
	},
	textButtons: {
		fontSize: 18,
		paddingLeft: 30,
		paddingEnd: 30,
		color: colors.white
	},
	searchContainer: {
		height: 50,
		borderColor: colors.tintColor,
		backgroundColor: colors.light_gray,
		marginTop: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	scanIcon: {
		flexDirection: 'column',
		alignItems: 'center'
	},
	iconOpaque: {
		color: colors.grey500
	},
	iconHighlighted: {
		color: colors.green
	},
	iconWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
});

function AddressNewScreen(props) {
	const navigation = useContext(NavigationContext);

	const [loaderVisible, setLoaderVisible] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [searchText, setSearchText] = useState('');

	const client = createApolloClient();

	const search = text => {
		setSearchText(text);
	};

	const submit = async () => {
		if (searchText.length > 0) {
			setLoaderVisible(true);
			// try {
			//     const { data } = await client.query({
			//         query: GET_USER_BY_EITHER_USERNAMES_OR_ADDRESSES,
			//         variables: { str: searchText },
			//     });
			//     if (data.users.nodes.length > 0) {
			//         const usInfo = data.users.nodes[0]
			//         setUserInfo(usInfo)
			//     } else {
			//         showAlert("We couldn't find any contact with name or address you entered, please enter the Name and BITG Address manually!")
			//         setUserInfo({})
			//     }
			// } catch (error) {
			//     showAlert("We couldn't find any contact with name or address you entered, please enter the Name and BITG Address manually!")
			//     setUserInfo({})
			// }
			setLoaderVisible(false);
		} else {
			showAlert('You need to write something to be able to search!');
		}
	};

	const nameChanged = text => {
		setSearchText('');
		setUserInfo({ ...userInfo, username: text });
	};

	const addressChanged = text => {
		setSearchText('');
		setUserInfo({ ...userInfo, bitgAddress: text });
	};

	const addContact = async () => {
		try {
			if (userInfo.bitgAddress != undefined) {
				setLoaderVisible(true);
				await sleep(1000);
				const wallet = WalletManager.getWalletByName('BITGWallet');
				const key = wallet.getKey(0);
				const userData = await getUserData();
				const myTransaction = {
					hash: '',
					sender: {
						name: JSON.parse(userData).updateUser.user.username,
						address: key.getAddress()
					},
					receiver: {
						name: userInfo.username === undefined ? 'No Name' : userInfo.username,
						address: userInfo.bitgAddress
					},
					send_amount: 0,
					time: Math.floor(Date.now() / 1000),
					is_expense: true,
					is_my_friend: true,
					color: getTransactionColor(userInfo.bitgAddress)
				};
				saveTransactionLocally(myTransaction);
				setLoaderVisible(false);
			} else {
				showAlert('Please enter at least BIT Address manually!');
			}
		} catch (error) {
			setLoaderVisible(false);
			showAlert('We have a problem with servers, plese try later again!');
		}
	};

	const saveTransactionLocally = async trans => {
		// const transactionList = await getUserTransactions()
		// const parseTransactions = JSON.parse(transactionList)
		// if (parseTransactions != undefined && parseTransactions != null && parseTransactions.length > 0) {
		//     const sameTrans = parseTransactions.filter(item => item.sender.address == trans.receiver.address || item.receiver.address == trans.receiver.address)
		//     if ((sameTrans === undefined || sameTrans === null) || sameTrans.length == 0) {
		//         parseTransactions.push(trans)
		//         await setUserTransactions(JSON.stringify(parseTransactions))
		//         setTransaction(parseTransactions)
		//         showSuccessfullyAlert(trans.receiver.name === "No Name" ? trans.receiver.address : trans.receiver.name)
		//     } else {
		//         if (sameTrans[0].is_my_friend) {
		//             showAlert("You already have this contact!")
		//         } else {
		//             parseTransactions.map(transItem => {
		//                 if (transItem.sender.address == trans.receiver.address || transItem.receiver.address == trans.receiver.address) {
		//                     transItem.is_my_friend = true
		//                 }
		//                 return transItem
		//             })
		//             await setUserTransactions(JSON.stringify(parseTransactions))
		//             setTransaction(parseTransactions)
		//             showSuccessfullyAlert(trans.receiver.name === "No Name" ? trans.receiver.address : trans.receiver.name)
		//         }
		//     }
		// } else {
		//     const transList = [trans]
		//     await setUserTransactions(JSON.stringify(transList))
		//     setTransaction(parseTransactions)
		//     showSuccessfullyAlert(trans.receiver.name === "No Name" ? trans.receiver.address : trans.receiver.name)
		// }
	};

	const showSuccessfullyAlert = name => {
		Alert.alert('BITG', `You added ${name} as your new contact`, [
			{
				text: 'OK',
				onPress: () => navigation.pop()
			}
		]);
	};

	const onSaveToAddressBook = () => {
		const { network } = this.props;
		const { toSelectedAddress, alias } = this.state;
		const { AddressBookController } = Engine.context;
		AddressBookController.set(toSelectedAddress, alias, network);
		this.toggleAddToAddressBookModal();
		this.setState({ toSelectedAddressName: alias, addToAddressToAddressBook: false, alias: undefined });
	};

	const onScan = () => {
		navigation.navigate('QRScanner', {
			onScanSuccess: meta => {
				if (meta.target_address) {
					console.log('scan address:',meta.target_address)
					const isValid = isValidAddressPolkadotAddress(meta.target_address)
					if(isValid){

						setUserInfo({ ...userInfo, bitgAddress: meta.target_address });
					}else{
						showAlert('Invalid Address:')
					}
					// this.onToSelectedAddressChange(meta.target_address);
				}
			}
		});
	};

	const onMenuPress = () => {
		navigation.pop();
	};

	return (
		<View style={styles.container}>
			<ToolBar background={colors.transparent} iconName="arrow-back" onMenuPress={onMenuPress} />
			<View style={styles.headerContainer}>
				<Text style={styles.titleText}>{strings('address_book.add_contact_title')}</Text>
				<Text style={styles.subTitleText}>{strings('address_book.add_to_address_book')}</Text>
			</View>

			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
				<ScrollView style={{ flex: 1 }}>
					<View style={styles.inputContainer}>
						<Text style={styles.inputTextTitle}>{strings('bitg_wallet.address_book.find_title')}</Text>
						<Text style={styles.text}>{strings('bitg_wallet.address_book.find_desc')}</Text>
						<View style={styles.searchContainer}>
							<MaterialIcons style={{ marginStart: 10 }} name="search" size={25} color={colors.grey300} />
							<TextInput
								style={[styles.input, { flex: 1 }]}
								placeholder={strings('bitg_wallet.search')}
								placeholderTextColor={colors.grey300}
								onChangeText={text => search(text)}
								onSubmitEditing={() => submit()}
								defaultValue={searchText}
							/>
						</View>
						{loaderVisible ? (
							<ActivityIndicator
								style={{ alignSelf: 'center', marginTop: 20 }}
								size="large"
								color={colors.tintColor}
							/>
						) : (
								<View style={{ flex: 1 }}>
									<Text style={[styles.inputTextTitle, { marginTop: 40 }]}>
										{strings('bitg_wallet.address_book.detail_title')}
									</Text>

									<TextInput
										style={[styles.input, { marginTop: 20 }]}
										placeholder={strings('bitg_wallet.address_book.identifier')}
										placeholderTextColor={colors.grey400}
										editable={false}
										defaultValue={userInfo.network}
									/>

									<TextInput
										style={[styles.input, { marginTop: 10 }]}
										placeholder={strings('bitg_wallet.address_book.name')}
										placeholderTextColor={colors.grey400}
										defaultValue={userInfo.username}
										onChangeText={text => nameChanged(text)}
									/>

									<View style={styles.selectWrapper}>
										<View style={styles.inputWrapper}>
											<TextInput
												autoCapitalize="none"
												autoCorrect={false}
												onChangeText={text => addressChanged(text)}
												placeholder={strings('bitg_wallet.address_book.address')}
												placeholderTextColor={colors.grey400}
												spellCheck={false}
												style={styles.textInput}
												numberOfLines={1}
												// onFocus={onInputFocus}
												// onBlur={onInputBlur}
												// onSubmitEditing={onSubmit}
												value={userInfo.bitgAddress}
												defaultValue={userInfo.bitgAddress}
												testID={'txn-to-address-input'}
											/>

										</View>




										<TouchableOpacity onPress={onScan} style={styles.iconWrapper}>
											<AntIcon
												name="scan1"
												size={20}
												style={[styles.scanIcon, styles.iconHighlighted]}
											/>
										</TouchableOpacity>
									</View>



									<TouchableOpacity style={styles.submitButton} activeOpacity={0.5} onPress={addContact}>
										<Text style={styles.textButtons}>{strings('address_book.add_contact')}</Text>
									</TouchableOpacity>
								</View>
							)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

AddressNewScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

AddressNewScreen.propTypes = {
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

const mapStateToProps = state => ({
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
	conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
	tokenExchangeRates: state.engine.backgroundState.TokenRatesController.contractExchangeRates,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency
});

export default connect(mapStateToProps)(AddressNewScreen);
