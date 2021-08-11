import React, { useEffect, useCallback, useState, useContext } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
	FlatList,
	ActivityIndicator,
	TextInput,
	TouchableOpacity,
	Dimensions
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
import { getEmptyHeaderOptions, getBITGWalletNavbarOptions ,getNetworkNavbarOptions} from '../UI/Navbar';

import { renderFromWei, weiToFiat, hexToBN, weiToFiatNumber, fiatNumberToWei, toWei } from '../../util/number';


import { NavigationContext } from 'react-navigation';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';


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
		marginStart: 40,
		marginTop: 20,
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
	},
	itemTitle:{
		color:colors.tintColor,
		fontSize:22,
		fontWeight:'bold',
		marginTop:7

	},
	itemContent: {
		color:colors.blackColor,
		fontSize:18,
		marginTop:5,
		marginStart:5
	}

});

const dummy_transactons = [

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
const TRANSACTION_QUERY_API = 'https://testnode.bitg.org:9443/'

const transactionApi = axios.create({
	baseURL: TRANSACTION_QUERY_API
});

// const getPartnerStatus = () => transakApi.get(`partners/${TRANSAK_API_KEY}`);
const getTransactonDetail = hash =>
	transactionApi.get(`transaction`, { params: { txhash: hash } });



function TransactionDetail(props) {
	const navigation = useContext(NavigationContext);

	const [loading, setLoading] = useState(false);

	const [transactionFiltered, setTransactionFiltered] = useState(dummy_transactons);

	const [transactions, setTransactions] = useState(dummy_transactons);

	const [type, setType] = useState('any');

	const [item, setItem] = useState(null)
	const [hash, setHash] = useState(null)

	useEffect(() => {
		async function fetchData(txhash) {
			try {
				// const {
				// 	data: { response } 
				// } = await getTransactonDetail(txhash);
				setLoading(true)
				const response = await axios.get(`${TRANSACTION_QUERY_API}transaction?txhash=${txhash}`);

				setLoading(false)

				if (!response) {
					console.log('query empty response:');
				} else {

					if(response.data === {}){
						setLoading(true)
						setTimeout( async () => {
							const response1 = await axios.get(`${TRANSACTION_QUERY_API}transaction?txhash=${txhash}`);
							setLoading(false)

							if(response1.data){
								
								setItem(response1.data)
							}

						},500)
					}
					console.log('response:', response.data)
					setItem(response.data)
				}
			} catch (error) {
				console.log('query error:', error);
				setLoading(false)
			}
		}

		const params = navigation.state.params;
		console.log('hash in detail:', params)
		if (params) {
			if (params.hash) {
				setHash(params.hash)
				fetchData(params.hash)
			}
		}
	}, []);


	const search = text => {
		const formattedQuery = text.toLowerCase().trim();
		const data = transactions.filter(item => {
			return contains(item, formattedQuery);
		});
		setTransactionFiltered(data);
	};

	const changeType = type => {
		setType(type);
		if (type === REWARD_TYPE) {
			const data = transactions.filter(item => {
				return item.is_reward
			});
			setTransactionFiltered(data);
		} else {
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
								<View style={{ flex: 1,marginTop:20 }}>
									<Text
										style={styles.itemTitle}
									>
										{`blocknumber:`}
									</Text>

									<Text style={styles.itemContent}
									>
										{itemData.blocknumber}
									</Text>

									<Text
										style={styles.itemTitle}
									>
										{`txhash:`}
									</Text>

									<Text style={styles.itemContent}
									>
										{itemData.txhash}
									</Text>

									<Text
										style={styles.itemTitle}
									>
										{`amount:`}
									</Text>

									<Text style={styles.itemContent}
									>
											{`${renderFromWei(itemData.amount)} BITG`}
									</Text>


									<Text
										style={styles.itemTitle}
									>
										{`blockchain time:`}
									</Text>

									<Text style={styles.itemContent}
									>
											{itemData.dtblockchain}
									</Text>

									<Text
										style={styles.itemTitle}
									>
										{`sender:`}
									</Text>

									<Text style={styles.itemContent}
									>
											{itemData.sender} 
									</Text>


									<Text
										style={styles.itemTitle}
									>
										{`recipient:`}
									</Text>

									<Text style={styles.itemContent}
									>
											{itemData.recipient} 
									</Text>

								</View>
							)}

					</View>

					{/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
						{
							itemData.sender === props.selectedAddress && (
								<Text
									style={{
										fontSize: 16,
										marginStart: 10,
										color: colors.grey500
									}}
								>
									{`${' - '}`.concat(formatNumber(itemData.amount, 2))}
								</Text>
							)
						}

						{
							itemData.recipient === props.selectedAddress && (
								<Text
									style={{
										fontSize: 16,
										marginStart: 10,
										color: colors.tintColor
									}}
								>
									{`${' + '}`.concat(formatNumber(itemData.amount, 2))}
								</Text>
							)
						}

					</View> */}
				</View>
			</TouchableRipple>
		);
	};

	const elipsizeName = name => (name.length >= 10 ? `${name.substring(0, 10)}...` : name);

	// console.log(transactionFiltered);

	return (
		<View style={styles.container}>
			{/* <View style={styles.buttonContainer}>
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
			</View> */}

			{
				loading && (
					<View style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}} >
						<ActivityIndicator style={{ alignSelf: 'center' }} size="large" color={colors.tintColor} />
					</View>
				)
			}

			{
				!loading && item && (
					<DetailTransactionItem itemData={item} />
				)
			}
		</View>
	);
}

TransactionDetail.navigationOptions = ({ navigation }) =>
	getBITGWalletNavbarOptions('drawer.transaction_history', navigation);

TransactionDetail.propTypes = {
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

export default connect(mapStateToProps)(TransactionDetail);
