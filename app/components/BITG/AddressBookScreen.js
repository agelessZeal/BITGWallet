import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableRipple, IconButton } from 'react-native-paper';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { getBITGAddNavbarOptions } from '../UI/Navbar';

import { getUserTransactions, setUserTransactions ,getTransactionColor} from './lib/Helpers';

// import { Context as TransactionContext } from '../lib/context/TransactionsContext'

import { NavigationContext } from 'react-navigation';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ToolBar from './ToolBar';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	searchContainer: {
		height: 50,
		borderRadius: 5,
		borderColor: colors.tintColor,
		backgroundColor: colors.light_gray,
		marginStart: 20,
		marginEnd: 20,
        marginTop: 20,
        marginBottom:15,
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		flex: 1,
		padding: 10,
		fontSize: 18,
		marginStart: 10,
		color: colors.blackColor
	},
	renderItem: {
		height: 90,
		alignSelf: 'stretch',
		backgroundColor: colors.white,
		borderBottomColor: colors.grey050,
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	hiddenItem: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	sendButton: {
		width: 90,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.tintColor
	},
	deleteButton: {
		width: 90,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.redColor
	},
	sendText: {
		color: colors.white,
		fontSize: 16
	},
	credential: {
		width: 60,
		height: 60,
		overflow: 'hidden',
		borderRadius: 30,
		backgroundColor: colors.tintColor,
		marginStart: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	credentialText: {
		color: colors.white,
		fontSize: 20
	},
	renderTextContainer: {
		flex: 1,
		marginStart: 20
	},
	renderTextTitle: {
		color: colors.grey,
		fontSize: 18,
		marginEnd: 20
	},
	renderTextSubTitle: {
        marginTop:5,
		color: colors.grey600,
		fontSize: 14
	},
	emptyAddressBookText: {
		fontSize: 20,
		color: colors.tintColor,
		alignSelf: 'center',
		marginTop: 40,
		marginStart: 20,
		marginEnd: 20,
		textAlign: 'center'
	}
});

const dummy_addresses = [
	{
        hash: "",
        sender: {
            name: "Joe Citizeon",
            address: "uytiuytiuytiuytukjytiu"
        },
        receiver: {
            name: "Kristiana",
            address: "Safsdafsdfasdf"
        },
        send_amount: 32.2,
        time: Math.floor(Date.now() / 1000),
        is_expense: true,
        is_my_friend: true,
		color: getTransactionColor('gdffgfsdfggdfgdf'),
		confirmations:4,

    },
    {
        hash: "",
        sender: {
            name: "Caroline",
            address: "uytiuytiuytiuytukjytiu"
        },
        receiver: {
            name: "Charmaine",
            address: "41234vfg23b4f"
        },
        send_amount: 23.30,
        time: Math.floor(Date.now() / 1000),
        is_expense: false,
        is_my_friend: true,
		color: getTransactionColor('434ree3423'),
		confirmations:2,

	}
];

function AddressBookScreen(props) {
	const navigation = useContext(NavigationContext);

	// const { state, setTransaction } = useContext(TransactionContext)

	const [loading, setLoading] = useState(false);
	const [addressBook, setAddressBook] = useState(dummy_addresses);
	const [userAddress, setUserAddress] = useState(props.selectedAddress);
	const [filteredAddressBook, setFilteredAddressBook] = useState(dummy_addresses);

	// useEffect(() => {
	//     if (!state.fromSameComponent) {
	//         (async () => {
	//             setLoading(true)
	//             try {
	//                 // const wallet = WalletManager.getWalletByName("BITGWallet");
	//                 // const key = wallet.getKey(0);
	//                 // const transactions = await getUserTransactions()
	//                 // const address = key.getAddress()
	//                 // if (transactions != undefined && transactions != null) {
	//                 //     const transactionsParse = JSON.parse(transactions)
	//                 //         .filter(item => item.is_my_friend === true)
	//                 //         .reduce((r, a) => {
	//                 //             r[a.is_expense ? a.receiver.address : a.sender.address] = [...r[a.is_expense ? a.receiver.address : a.sender.address] || [], a];
	//                 //             return r;
	//                 //         }, {})
	//                 //     setUserAddress(address)
	//                 //     setAddressBook(Object.values(transactionsParse))
	//                 //     setFilteredAddressBook(Object.values(transactionsParse))
	//                 // }
	//             } catch (error) {
	//                 console.log(error);
	//             }
	//             setLoading(false)
	//         })();
	//     }
	// }, [state]);

	const onMenuPress = () => {
		navigation.toggleDrawer();
	};

	const onAddPress = () => {
		// const pushAction = StackActions.push(Routes.NEW_CONTACT_SCREEN.TAG)
		// navigation.dispatch(pushAction)
	};

	const onItemPressed = (itemData, userAddress) => {
		const address =
			userAddress == itemData.item.receiver.address
				? itemData.item.sender.address
				: itemData.item.receiver.address;
				
		const name =
			userAddress == itemData.item.receiver.address
				? itemData.item.sender.name
                : itemData.item.receiver.name;
                
        navigation.navigate("AddressDetail", { address,name ,data:itemData}) 

		// const pushAction = StackActions.push(Routes.DETAIL_ADDRESS_BOOK_SCREEN.TAG, { address: address })
		// navigation.dispatch(pushAction)
	};

	const onItemSendPressed = (itemData, userAddress) => {
		const address =
			userAddress == itemData.item.receiver.address
				? itemData.item.sender.address
				: itemData.item.receiver.address;
		const name =
			userAddress == itemData.item.receiver.address
				? itemData.item.sender.name
                : itemData.item.receiver.name;
                
        navigation.navigate("SendView", { data: { address: address, name: name } })        
		// const pushAction = StackActions.push(Routes.SEND_SCREEN.TAG, { data: { address: address, name: name } })
		// navigation.dispatch(pushAction)
	};

	const onItemDeletePressed = async (itemData, userAddress) => {
		const index = addressBook.indexOf(itemData.item);
		if (index > -1) {
			addressBook.splice(index, 1);
		}
		setAddressBook(Object.values(addressBook));
		setFilteredAddressBook(Object.values(addressBook));

		try {
			// const transactions = await getUserTransactions()
			// const transactionsParse = JSON.parse(transactions)
			// for (let tItem of transactionsParse) {
			//     for (let dItem of itemData.item) {
			//         if (tItem.hash === dItem.hash) {
			//             tItem.is_my_friend = false
			//         }
			//     }
			// }
			// setUserTransactions(JSON.stringify(transactionsParse))
			// setTransaction(transactionsParse, true)
		} catch (error) {
			console.log(error);
		}
	};

	const search = text => {
		const formattedQuery = text.toLowerCase().trim();
		const data = addressBook.filter(item => {
			return contains(item, formattedQuery);
		});
		setFilteredAddressBook(data);
	};

	const contains = (item, query) => {
		if (
			item.sender.name.toLowerCase().includes(query) ||
			item.receiver.name.toLowerCase().includes(query) ||
			item.sender.address.toLowerCase().includes(query) ||
			item.receiver.address.toLowerCase().includes(query)
		) {
			return true;
		}
		return false;
	};

	const RenderItem = ({ itemPressed, itemData, userAddress }) => {

        return (
			<TouchableRipple onPress={() => itemPressed(itemData, userAddress)}>
				<View style={styles.renderItem}>
					<View style={[styles.credential, { backgroundColor: itemData.item.color }]}>
						<Text style={styles.credentialText}>
							{userAddress == itemData.item.receiver.address
								? itemData.item.sender.name.charAt(0)
								: itemData.item.receiver.name.charAt(0)}
						</Text>
					</View>
					<View style={styles.renderTextContainer}>
						<Text style={styles.renderTextTitle} numberOfLines={1}>
							{userAddress == itemData.item.receiver.address
								? itemData.item.sender.name === 'No Name'
									? itemData.item.sender.address
									: itemData.item.sender.name
								: itemData.item.receiver.name === 'No Name'
								? itemData.item.receiver.address
								: itemData.item.receiver.name}
						</Text>
						<Text style={styles.renderTextSubTitle}>{itemHistory(itemData)}</Text>
					</View>
				</View>
			</TouchableRipple>
		);
	};

	const itemHistory = inData => {
		// const latestTransaction = inData.item
		// 	.filter(item => isToday(item.time * 1000) && item.send_amount > 0)
		// 	.sort((a, b) => b.time - a.time)[0];

		let historyText = 'No history for today';
		// if (latestTransaction !== undefined && latestTransaction !== null) {
		// 	if (latestTransaction.is_expense) {
		// 		historyText = `${'You sent'} ${latestTransaction.send_amount} ${'BITG today'}`;
		// 	} else {
		// 		historyText = `${'Sent you'} ${latestTransaction.send_amount} ${'BITG today'}`;
		// 	}
		// }
		return historyText;
	};

	const HiddenItem = ({ itemData, userAddress, sendPressed, deletePressed }) => (
		<View style={styles.hiddenItem}>
			<TouchableRipple style={styles.sendButton} onPress={() => sendPressed(itemData, userAddress)}>
				<Text style={styles.sendText}>{strings('wallet.send_button')}</Text>
			</TouchableRipple>
			<TouchableRipple style={styles.deleteButton} onPress={() => deletePressed(itemData, userAddress)}>
				<IconButton icon="close" size={30} color={colors.white} />
			</TouchableRipple>
		</View>
	);

	const isToday = timeStamp => {
		var date = new Date(timeStamp);
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	return (
		<View style={styles.container}>
			{loading ? (
				<ActivityIndicator style={{ alignSelf: 'center' }} size="large" color={colors.tintColor} />
			) : addressBook.length === 0 ? (
				<Text style={styles.emptyAddressBookText}>{strings('bitg_wallet.no_address')}</Text>
			) : (
				<View style={{ flex: 1 }}>
					<View style={styles.searchContainer}>
						<MaterialIcons style={{ marginStart: 10 }} name="search" size={25} color={colors.grey300} />
						<TextInput
							style={styles.input}
							placeholder={strings('bitg_wallet.search')}
							placeholderTextColor={colors.grey300}
							onChangeText={text => search(text)}
						/>
					</View>
					<SwipeListView
						data={filteredAddressBook}
						useFlatList={true}
						keyExtractor={(item, index) => index.toString()}
						renderItem={(data, rowMap) => (
							<RenderItem itemPressed={onItemPressed} itemData={data} userAddress={userAddress} />
						)}
						renderHiddenItem={(data, rowMap) => (
							<HiddenItem
								itemData={data}
								userAddress={userAddress}
								sendPressed={onItemSendPressed}
								deletePressed={onItemDeletePressed}
							/>
						)}
						leftOpenValue={90}
						rightOpenValue={-90}
					/>
				</View>
			)}
		</View>
	);
}

AddressBookScreen.navigationOptions = ({ navigation }) => getBITGAddNavbarOptions('drawer.address_book', navigation,'address');

AddressBookScreen.propTypes = {
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

export default connect(mapStateToProps)(AddressBookScreen);
