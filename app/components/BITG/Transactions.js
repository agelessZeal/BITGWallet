import React, { useEffect, useCallback, useState, useContext } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
	FlatList,
	ActivityIndicator,
	TextInput,
	TouchableOpacity
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import ProgressCircle from 'react-native-progress-circle';

import { formatNumber, getUserTransactions, getTransactionColor } from './lib/Helpers';
// import { Context as TransactionContext } from './lib/context/TransactionsContext'

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { getEmptyHeaderOptions, getBITGWalletNavbarOptions } from '../UI/Navbar';

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

	searchContainer: {
		height: 50,
		borderRadius: 5,
		borderColor: colors.tintColor,
		borderWidth: 1,
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
	buttonContainer: {
		justifyContent: 'flex-start',
		alignSelf: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: '100%',
		marginStart: 40
	},

	inactiveButtons: {
		height: 50,
		paddingHorizontal: 20,
		borderRadius: 25,
		backgroundColor: colors.white100,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		marginHorizontal: 10,
		color: colors.grey200
	},
	activeButtons: {
		height: 50,
		paddingHorizontal: 20,
		borderRadius: 25,
		backgroundColor: colors.tintColor,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		marginHorizontal: 10,
		color: colors.white
	},
	activeText: {
		fontSize: 16,
		color: colors.white
	},
	inactiveText: {
		fontSize: 16,
		color: colors.grey200
	},
	dashView: {
		height: 1,
		width: 15,
		backgroundColor: colors.grey100
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

const dummy_transactons = [
	{
		hash: '',
		sender: {
			name: 'Joe Citizeon',
			address: 'uytiuytiuytiuytukjytiu'
		},
		receiver: {
			name: 'Kristiana',
			address: 'Safsdafsdfasdf'
		},
		send_amount: 32.2,
		time: Math.floor(Date.now() / 1000),
		is_expense: true,
		is_reward: false,
		is_my_friend: true,
		color: getTransactionColor('gdffgfsdfggdfgdf'),
		confirmations: 4
	},
	{
		hash: '',
		sender: {
			name: 'Mary',
			address: 'uytiuytiuytiuytukjytiu'
		},
		receiver: {
			name: 'Avartar',
			address: '41234vfg23b4f'
		},
		send_amount: 23.3,
		time: Math.floor((Date.now() - 345234234) / 1000),
		is_expense: false,
		is_my_friend: true,
		is_reward: false,
		color: getTransactionColor('434ree3423'),
		confirmations: 6
	},
	{
		hash: '',
		sender: {
			name: 'George',
			address: 'uytiuytiuytiuytukjytiu'
		},
		receiver: {
			name: 'Me',
			address: '41234vfg23b4f'
		},
		send_amount: 13.3,
		time: Math.floor((Date.now() - 3452342134) / 1000),
		is_expense: false,
		is_my_friend: false,
		is_reward: true,
		color: getTransactionColor('434ree3423'),
		confirmations: 6
	},
	{
		hash: '',
		sender: {
			name: 'Caroline',
			address: 'uytiuytiuytiuytukjytiu'
		},
		receiver: {
			name: 'Charmaine',
			address: '41234vfg23b4f'
		},
		send_amount: 233.3,
		time: Math.floor((Date.now() - 945345234) / 1000),
		is_expense: false,
		is_my_friend: true,
		is_reward: false,
		color: getTransactionColor('434ree3423'),
		confirmations: 7
	}
];

const ANY_TYPE = 'any'
const REWARD_TYPE = 'reward'

function TransactionHistory(props) {
	const navigation = useContext(NavigationContext);

	const [loading, setLoading] = useState(false);

	const [transactionFiltered, setTransactionFiltered] = useState(dummy_transactons);

	const [transactions, setTransactions] = useState(dummy_transactons);

	const [type, setType] = useState('any');

	useEffect(() => {}, []);

	const search = text => {
		const formattedQuery = text.toLowerCase().trim();
		const data = transactions.filter(item => {
			return contains(item, formattedQuery);
		});
		setTransactionFiltered(data);
	};

	const changeType = type => {
		setType(type);
		if(type === REWARD_TYPE){
			const data = transactions.filter(item => {
				 return item.is_reward
			});
			setTransactionFiltered(data);
		}else{
			setTransactionFiltered(transactions);
		}


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

	const DetailTransactionItem = ({ itemData }) => {
		// console.log('item:', itemData, transactionFiltered);

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
						{itemData.is_reward ? (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text
									style={{
										fontSize: 18,
										color: colors.grey500 
									}}
								>
									You were

								</Text>
								<Text
									style={{
										fontSize: 16,
										marginStart: 10,
										color: colors.blackColor 
									}}
								>
									Rewarded
								</Text>
								<MaterialIcons style={{ marginHorizontal: 5 }} name="star" size={20} color={colors.green} />
							</View>
						) : (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text
									style={{
										fontSize: 18,
										color: itemData.is_expense ? colors.grey500 : colors.blackColor
									}}
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
						)}

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

	console.log(transactionFiltered);

	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<MaterialIcons style={{ marginStart: 10 }} name="search" size={25} color={colors.grey300} />
				<TextInput
					style={styles.input}
					placeholder={strings('bitg_wallet.search')}
					placeholderTextColor={colors.grey300}
					onChangeText={text => search(text)}
				/>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={type === ANY_TYPE ? styles.activeButtons : styles.inactiveButtons}
					underlayColor={colors.darkTintColor}
					onPress={() => changeType(ANY_TYPE)}
				>
					<Text style={type === ANY_TYPE ? styles.activeText : styles.inactiveText}>
						{strings('bitg_wallet.any')}
					</Text>
				</TouchableOpacity>
				<View style={styles.dashView} />
				<TouchableOpacity
					style={type === REWARD_TYPE ? styles.activeButtons : styles.inactiveButtons}
					underlayColor={colors.darkTintColor}
					onPress={() => changeType(REWARD_TYPE)}
				>
					<MaterialIcons style={{ marginHorizontal: 5 }} name="star" size={25} color={colors.grey000} />
					<Text style={type === REWARD_TYPE ? styles.activeText : styles.inactiveText}>
						{strings('bitg_wallet.reward')}
					</Text>
				</TouchableOpacity>
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
						renderItem={({ item }) => <DetailTransactionItem itemData={item} />}
					/>
				</>
			)}
		</View>
	);
}

TransactionHistory.navigationOptions = ({ navigation }) =>
	getBITGWalletNavbarOptions('drawer.transaction_history', navigation);

TransactionHistory.propTypes = {
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

export default connect(mapStateToProps)(TransactionHistory);
