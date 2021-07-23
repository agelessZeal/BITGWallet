import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList, ActivityIndicator } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import ProgressCircle from 'react-native-progress-circle';

import { formatNumber, getUserTransactions } from './lib/Helpers';
// import { Context as TransactionContext } from './lib/context/TransactionsContext'

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { getEmptyHeaderOptions } from '../UI/Navbar';

// import { getUserTransactions, setUserTransactions ,getTransactionColor} from './lib/Helpers';

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
	headerContainer: {
		backgroundColor: colors.darkTintColor,
		justifyContent: 'center',
		alignItems: 'center',
        height: 200,
        marginBottom:30,
	},

	buttonContainer: {
		position: 'absolute',
		alignSelf: 'center',
		flexDirection: 'row',
		bottom: -20
	},
	headerButtons: {
		height: 50,
		width: 150,
		borderRadius: 25,
		backgroundColor: colors.tintColor,
		alignItems: 'center',
		justifyContent: 'center'
	},
	textButton: {
		fontSize: 16,
		color: colors.white
	},
	textTitleHeader: {
		marginTop: 20,
		fontSize: 24,
		textAlign: 'center',
		color: colors.white
	},
	textSubTitleHeader: {
		fontSize: 18,
		marginTop: 10,
		color: colors.white
	},
	textSubTitleDaysHeader: {
		fontSize: 16,
		color: colors.white
	},
	addressItem: {
		height: 70,
		alignSelf: 'stretch',
		marginStart: 20,
		marginEnd: 20
	}
});

function AddressDetailScreen(props) {
	const navigation = useContext(NavigationContext);

	const [loading, setLoading] = useState(false);

	const [transactionFiltered, setTransactionFiltered] = useState([]);
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');

	useEffect(() => {
		const data = navigation.state.params;
		if (data) {
			setName(data.name);
			setAddress(data.address);
			setTransactionFiltered([data.data]);
		}
	}, []);

	// useEffect(() => {
	//     getTransactionByAddress()
	// }, [state]);

	const getTransactionByAddress = async () => {
		// setLoading(true)
		// try {
		//     const transactions = await getUserTransactions()
		//     const transactionsParse = JSON.parse(transactions)
		//         .filter(item => item.receiver.address === route.params.address || item.sender.address === route.params.address)
		//     const transaction = transactionsParse[0]
		//     if (transaction !== undefined && transaction !== null) {
		//         const sender = transaction.sender.name === "No Name" ? transaction.sender.address : transaction.sender.name
		//         const receiver = transaction.receiver.name === "No Name" ? transaction.receiver.address : transaction.receiver.name
		//         const name = transaction.is_expense ? receiver : sender
		//         setName(name)
		//     }
		//     setTransactionFiltered(transactionsParse.filter(item => item.send_amount > 0))
		// } catch (error) {
		// }
		// setLoading(false)
	};

	const onMenuPress = () => {
		navigation.goBack();
	};

	const openSendSreen = () => {
       
        navigation.navigate('SendView', { data: { address, name } })
	};

	const openReceiveScreen = () => {
        navigation.navigate('ReceiveScreen', { data: { address, name } })
	};

	const numberOfDays = transactions => {
        var timestamp = Math.min.apply(null, transactions.map(tx => tx.item.time * 1000));

        if(timestamp === NaN){
            return 0;
        }

        var date = new Date(timestamp);

		var currentDay = new Date();
		return dateDiff(date, currentDay);
	};

	function dateDiff(first, second) {
		return Math.round((second - first) / (1000 * 60 * 60 * 24));
	}

	const DetailAddressItem = ({ itemData }) => {

		console.log('addressbook:',itemData)
		return (
			<TouchableRipple style={styles.addressItem}>
				<View style={{ flex: 1, flexDirection: 'row' }}>

					<View style={{ width: 15, alignItems: 'center' }}>
						{itemData.confirmations < 6 ? (
							<ProgressCircle
								percent={(itemData.confirmations / 6) * 100}
								radius={8}
								borderWidth={2}
								color={colors.tintColor}
								shadowColor={colors.grey500}
								bgColor={colors.white}
							/>
						) : (
							<MaterialIcons name="done" size={15} color={colors.tintColor} />
						)}
						<View style={{ height: 40, width: 2, marginTop: 5, backgroundColor: colors.grey200 }} />
					</View>

					<View style={{ marginStart: 10, flex: 1 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text
								style={{ fontSize: 18, color: itemData.is_expense ? colors.grey500 : colors.blackColor }}
							>
								{itemData.is_expense
									? 'You sent'
									: itemData.sender.name === 'No Name'
									? elipsizeName(itemData.sender.address)
									: elipsizeName(itemData.sender.name)}
							</Text>
							<Text
								style={{
									fontSize: 16,
									marginStart: 10,
									color: itemData.is_expense ? colors.blackColor : colors.grey500
								}}
							>
								{itemData.is_expense
									? itemData.receiver.name === 'No Name'
										? elipsizeName(itemData.receiver.address)
										: elipsizeName(itemData.receiver.name)
									: 'sent you'}
							</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							{/* <Feather name="clock" size={14} color={colors.grey500} /> */}
							<Text style={{ fontSize: 14, color: colors.grey500 }}>
								{Moment(itemData.time * 1000).calendar()}
							</Text>
						</View>
						{itemData.confirmations < 6 ? (
							<Text style={{ fontSize: 12, color: colors.grey500 }}>
								{`Wait for this transaction to be completed`}
							</Text>
						) : null}
					</View>
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Text
							style={{
								fontSize: 16,
								marginStart: 10,
								color: itemData.is_expense ? colors.grey500 : colors.tintColor
							}}
						>
							{`${itemData.is_expense ? ' - ' : ' + '}`.concat(formatNumber(itemData.send_amount, 2))}
						</Text>
					</View>
				</View>
			</TouchableRipple>
		);
	};

	const elipsizeName = name => (name.length >= 10 ? `${name.substring(0, 10)}...` : name);

	return (
		<View style={styles.container}>
			<ToolBar background={colors.transparent} iconName="arrow-back" onMenuPress={onMenuPress} />
			<View style={styles.headerContainer}>
				<Text style={styles.textTitleHeader}>{name}</Text>
				<Text style={styles.textSubTitleHeader}>
					{`${transactionFiltered.length} ${transactionFiltered.length > 1 ? `Transactions` : `Transaction`}`}
				</Text>
				<Text style={styles.textSubTitleDaysHeader}>
					{transactionFiltered.length === 0
						? ''
						: `${`Known for ${numberOfDays(transactionFiltered)} ${
								numberOfDays(transactionFiltered) > 1 ? `days` : `day`
						  }`}`}
				</Text>

				<View style={styles.buttonContainer}>
					<TouchableHighlight
						style={[styles.headerButtons, { marginEnd: 5 }]}
						underlayColor={colors.darkTintColor}
						onPress={() => openSendSreen()}
					>
						<Text style={styles.textButton}>{strings('wallet.send_button')}</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={[styles.headerButtons, { marginStart: 5 }]}
						underlayColor={colors.darkTintColor}
						onPress={() => openReceiveScreen()}
					>
						<Text style={styles.textButton}>{strings('payment_request.title')}</Text>
					</TouchableHighlight>
				</View>
			</View>

			{loading ? (
				<ActivityIndicator style={{ alignSelf: 'center' }} size="large" color={colors.tintColor} />
			) : (
				<>
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
						data={transactionFiltered
							.sort(
								(a, b) =>
									Moment(a.time * 1000).format('YYYYMMDD') - Moment(b.time * 1000).format('YYYYMMDD')
							)
							.reverse()}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => <DetailAddressItem itemData={item.item} />}
					/>
				</>
			)}
		</View>
	);
}

AddressDetailScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

AddressDetailScreen.propTypes = {
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
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency,
	addressBook: state.engine.backgroundState.AddressBookController.addressBook,
	identities: state.engine.backgroundState.PreferencesController.identities,
	network: state.engine.backgroundState.NetworkController.network,
	transactions: state.engine.backgroundState.TransactionController.transactions
	
});

export default connect(mapStateToProps)(AddressDetailScreen);
