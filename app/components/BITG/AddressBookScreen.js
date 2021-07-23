import React, { useEffect, useCallback, useState, useContext,useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableRipple, IconButton } from 'react-native-paper';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { getBITGAddNavbarOptions } from '../UI/Navbar';

import { safeToChecksumAddress } from '../../util/address';
import Fuse from 'fuse.js';

import { getUserTransactions, setUserTransactions, getTransactionColor } from './lib/Helpers';

// import { Context as TransactionContext } from '../lib/context/TransactionsContext'

import { NavigationContext } from 'react-navigation';

import Engine from '../../core/Engine';

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
		marginBottom: 15,
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
		marginTop: 5,
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
	},
	labelElementWrapper: {
		backgroundColor: colors.grey000,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: colors.grey050,
		padding: 8
	},
	labelElementInitialText: {
		textTransform: 'uppercase'
	},
	labelElementText: {
		...fontStyles.normal,
		fontSize: 12,
		marginHorizontal: 8,
		color: colors.grey600
	}
});

const LabelElement = label => (
	<View key={label} style={styles.labelElementWrapper}>
		<Text style={[styles.labelElementText, label.length > 1 ? {} : styles.labelElementInitialText]}>{label}</Text>
	</View>
);


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
		confirmations: 4,

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
		confirmations: 2,

	}
];

function AddressBookScreen(props) {
	const navigation = useContext(NavigationContext);

	// const { state, setTransaction } = useContext(TransactionContext)

	const [loading, setLoading] = useState(false);
	const [addressBook, setAddressBook] = useState(dummy_addresses);
	const [userAddress, setUserAddress] = useState(props.selectedAddress);
	const [filteredAddressBook, setFilteredAddressBook] = useState(dummy_addresses);

	const [myAccountsOpened, setMyAccountsOpened] = useState(false);

	const [processedAddressBookList, setProcessedAddressBookList] = useState(undefined);

	const [processedRecentsList, setProcessedRecentsList] = useState(undefined);

	const [contactElements, setContactElements] = useState([])
	const [totalAddress,setTotalAddress] = useState(0);

	let networkAddressBook = {};
	// let fuse;

	const fuse = useMemo(() => {
		const { addressBook, network } = props;
		networkAddressBook = addressBook[network] || {};
		const networkAddressBookList = Object.keys(networkAddressBook).map(
			address => networkAddressBook[address]
		);
		const searchedFuse = new Fuse(networkAddressBookList, {
			shouldSort: true,
			threshold: 0.45,
			location: 0,
			distance: 10,
			maxPatternLength: 32,
			minMatchCharLength: 1,
			keys: [{ name: 'name', weight: 0.5 }, { name: 'address', weight: 0.5 }]
		});
		return searchedFuse;
	}, [props.addressBook]);

	useEffect(() => {

		const { addressBook, network } = props;
		networkAddressBook = addressBook[network] || {};
		const networkAddressBookList = Object.keys(networkAddressBook).map(
			address => networkAddressBook[address]
		);
		// getRecentAddresses();
		setTotalAddress(networkAddressBookList)

		parseAddressBook(networkAddressBookList);

	}, [props.addressBook])

	const search = text => {
		const formattedQuery = text.toLowerCase().trim();

		const { network, addressBook, reloadAddressList } = props;

		let networkAddressBookList;
		if (formattedQuery) {
			networkAddressBookList = fuse.search(formattedQuery);
		} else {
			const { addressBook } = props;
			const networkAddressBook = addressBook[network] || {};
			networkAddressBookList = Object.keys(networkAddressBook).map(address => networkAddressBook[address]);
		}
		// getRecentAddresses(formattedQuery);
		parseAddressBook(networkAddressBookList);
	};


	const openMyAccounts = () => {
		setMyAccountsOpened(true)
	};

	const getRecentAddresses = inputSearch => {
		const { transactions, network, identities, onAccountPress, onAccountLongPress } = props;
		const recents = [];
		let parsedRecents = [];
		if (!inputSearch) {
			const networkTransactions = transactions
				.filter(tx => tx.networkID === network)
				.sort((a, b) => b.time - a.time);
			networkTransactions.forEach(async ({ transaction: { to, data } }) => {
				// ignore contract deployments
				if (!to) return;
				// Check if is a transfer tx
				if (data && data.substring(0, 10) === TRANSFER_FUNCTION_SIGNATURE) {
					[to] = decodeTransferData('transfer', data);
				} else if (data && data.substring(0, 10) === TRANSFER_FROM_FUNCTION_SIGNATURE) {
					[, to] = decodeTransferData('transferFrom', data);
				}
				const checksummedTo = safeToChecksumAddress(to);
				if (recents.length > 2) return;
				if (!recents.includes(checksummedTo) && !Object.keys(identities).includes(checksummedTo)) {
					recents.push(checksummedTo);
					if (networkAddressBook[checksummedTo]) {
						// parsedRecents.push(
						// 	<AddressElement
						// 		key={checksummedTo}
						// 		address={checksummedTo}
						// 		name={this.networkAddressBook[checksummedTo].name}
						// 		onAccountPress={onAccountPress}
						// 		onAccountLongPress={onAccountLongPress}
						// 	/>
						// );
					} else {
						// parsedRecents.push(
						// 	<AddressElement
						// 		key={checksummedTo}
						// 		address={checksummedTo}
						// 		onAccountPress={onAccountPress}
						// 		onAccountLongPress={onAccountLongPress}
						// 	/>
						// );
					}
				}
			});
			parsedRecents.length && parsedRecents.unshift(LabelElement(strings('address_book.recents')));
		}

		setProcessedRecentsList(parsedRecents)
	};

	const parseAddressBook = networkAddressBookList => {
		const contactElements = [];
		const addressBookTree = {};
		networkAddressBookList.forEach(contact => {
			const contactNameInitial = contact && contact.name && contact.name[0];
			const nameInitial = contactNameInitial && contactNameInitial.match(/[a-z]/i);
			const initial = nameInitial ? nameInitial[0] : strings('address_book.others');
			if (Object.keys(addressBookTree).includes(initial)) {
				addressBookTree[initial].push(contact);
			} else {
				addressBookTree[initial] = [contact];
			}
		});
		Object.keys(addressBookTree)
			.sort()
			.forEach(initial => {
				contactElements.push(initial);
				addressBookTree[initial].forEach(contact => {
					contactElements.push(contact);
				});
			});

		setContactElements(contactElements)
	};

	const renderMyAccounts = () => {
		const { identities, onAccountPress, inputSearch, onAccountLongPress } = props;
		if (inputSearch) return;
		return !myAccountsOpened ? (
			<TouchableOpacity
				style={styles.myAccountsTouchable}
				onPress={openMyAccounts}
				testID={'my-accounts-button'}
			>
				<Text style={[styles.messageText, styles.messageLeft]}>{strings('address_book.between_account')}</Text>
			</TouchableOpacity>
		) : (
				<View>
					{Object.keys(identities).map(address => (
						<AddressElement
							key={address}
							address={address}
							name={identities[address].name}
							onAccountPress={onAccountPress}
							onAccountLongPress={onAccountLongPress}
							testID={'account-identity'}
						/>
					))}
				</View>
			);
	};

	const onItemPressed = (itemData, userAddress) => {

		const address = itemData.item.address
		const name = itemData.item.name
        const element =  itemData.item;
		navigation.navigate("AddressDetail", { address,data: element })
	};

	const onItemSendPressed = (itemData, userAddress) => {r
		const address = itemData.item.address
		const name = itemData.item.name
		navigation.navigate("SendView", { data: { address: address, name: name } })
	};

	const onItemDeletePressed = async (itemData, userAddress) => {
		// const index = addressBook.indexOf(itemData.item);
		// if (index > -1) {
		// 	addressBook.splice(index, 1);
		// }
		// setAddressBook(Object.values(addressBook));
		// setFilteredAddressBook(Object.values(addressBook));

	    const { AddressBookController } = Engine.context;
		const { network } = props;
		AddressBookController.delete(network, itemData.item.address);
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


	const elementKeyExtractor = element => {
		if (typeof element === 'string') return element;
		return element.address + element.name;
	};

	const renderElement = ({ item: element }) => {
		const { onAccountPress, onAccountLongPress } = this.props;
		if (typeof element === 'string') {
			return LabelElement(element);
		}
		return (
			<AddressElement
				address={element.address}
				name={element.name}
				onAccountPress={onAccountPress}
				onAccountLongPress={onAccountLongPress}
			/>
		);
	};


	const RenderItem = ({ itemPressed, itemData, userAddress }) => {

		if (typeof itemData.item === 'string') {
			return LabelElement(itemData.item);
		}

		const color = getTransactionColor(itemData.item.name);

		return (
			<TouchableRipple onPress={() => itemPressed(itemData, userAddress)}>
				<View style={styles.renderItem}>
					<View style={[styles.credential, { backgroundColor: color }]}>
						<Text style={styles.credentialText}>
							{userAddress == itemData.item.address
								? itemData.item.name.charAt(0)
								: itemData.item.name.charAt(0)}
						</Text>
					</View>
					<View style={styles.renderTextContainer}>
						<Text style={styles.renderTextTitle} numberOfLines={1}>
							{userAddress == itemData.item.address
								? itemData.item.name === 'No Name'
									? itemData.item.address
									: itemData.item.name
								: itemData.item.name === 'No Name'
									? itemData.item.address
									: itemData.item.name}
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

	const HiddenItem = ({ itemData, userAddress, sendPressed, deletePressed }) => {
		if (typeof itemData.item === 'string') {
			return LabelElement(itemData.item);
		}
		return (
			<View style={styles.hiddenItem}>
				<TouchableRipple style={styles.sendButton} onPress={() => sendPressed(itemData, userAddress)}>
					<Text style={styles.sendText}>{strings('wallet.send_button')}</Text>
				</TouchableRipple>
				<TouchableRipple style={styles.deleteButton} onPress={() => deletePressed(itemData, userAddress)}>
					<IconButton icon="close" size={30} color={colors.white} />
				</TouchableRipple>
			</View>
		)
	};

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
			) : totalAddress.length === 0 ? (
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
								data={contactElements}
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

AddressBookScreen.navigationOptions = ({ navigation }) => getBITGAddNavbarOptions('bitg_wallet.address_book.drawer', navigation, 'address');

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
	tokenExchangeRates: PropTypes.object,

	/**
	 * List of accounts from the PreferencesController
	*/
	identities: PropTypes.object,
	/**
	 * Map representing the address book
	 */
	addressBook: PropTypes.object,
	/**
	 * Search input from parent component
	 */
	inputSearch: PropTypes.string,
	/**
	 * Network id
	 */
	network: PropTypes.string,
	/**
	 * Callback called when account in address book is pressed
	 */
	onAccountPress: PropTypes.func,
	/**
	 * Callback called when account in address book is long pressed
	 */
	onAccountLongPress: PropTypes.func,
	/**
	 * An array that represents the user transactions
	 */
	transactions: PropTypes.array,
	/**
	 * Whether it only has to render address book
	 */
	onlyRenderAddressBook: PropTypes.bool,
	reloadAddressList: PropTypes.bool
};

const mapStateToProps = state => ({
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
	conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
	tokenExchangeRates: state.engine.backgroundState.TokenRatesController.contractExchangeRates,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency,
	addressBook: state.engine.backgroundState.AddressBookController.addressBook,
	identities: state.engine.backgroundState.PreferencesController.identities,
	network: state.engine.backgroundState.NetworkController.network,
	transactions: state.engine.backgroundState.TransactionController.transactions

});

export default connect(mapStateToProps)(AddressBookScreen);
