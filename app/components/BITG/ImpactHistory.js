import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { getNavigationOptionsTitle } from '../UI/Navbar';

import Feather from 'react-native-vector-icons/Feather';

import { getParseDate } from './lib/Helpers';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	itemContainer: {
		flex: 1,
		flexDirection: 'column',
		overflow: 'hidden',
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderColor: colors.grey000,
		marginTop: 10
	},
	imgBG: {
		width: '90%',
		resizeMode: 'contain'
	},
	bitgImage: {
		marginStart: 5,
		width: 12,
		height: 12,
		resizeMode: 'contain'
	},
	extraView: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginEnd: 10
	},
	rewardText: {
		color: colors.green,
		fontSize: 16,
		fontWeight: '400'
	},
	titleWrapper: {
		marginHorizontal: 20,
		marginTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	titleWrapper1: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	titleText: {
		marginStart:4,
		color: colors.green,
		fontSize: 14,
		textTransform: 'uppercase'
	},
	totalBitgImage: {
		marginEnd: 5,
		width: 12,
		height: 12,
		resizeMode: 'contain',
		tintColor:colors.grey500
	},
	rewardView: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	totalRewardText: {
		color: colors.grey400,
		fontSize: 17,
		fontWeight: '400'
	},
});

const bitgImageSource = require('../../images/ic_bitg.png');

const impact_activities = [
	{
		id: '1',
		name: 'Action 1',
		reward: 5.2,
		date: 'June 12 2011',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		icon: require('../../images/earth-day-initiative-inverse.png'),
		share: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		position: '345 Some Lane Town, City, Country'
	},
	{
		id: '2',
		name: 'Action 2',
		reward: 2.2,
		date: 'June 12 2011',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		icon: require('../../images/earth-day-initiative-inverse.png'),
		share: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		position: '345 Some Lane Town, City, Country'
	},
	{
		id: '3',
		name: 'Action 3',
		reward: 3.2,
		date: 'June 12 2011',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		icon: require('../../images/earth-day-initiative-inverse.png'),
		share: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		position: '345 Some Lane Town, City, Country'
	}
];

class ImpactHistory extends PureComponent {
	static navigationOptions = ({ navigation }) =>
		getNavigationOptionsTitle(strings('bitg_wallet.impact_history'), navigation);

	static propTypes = {
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
		loading: false,
		error: null,
		ready: true,
		histories: impact_activities,
		week_reward:10.401,
		month_reward:27.234,
		older_reward:234.234,
	};

	componentDidMount() {}

	onRefresh = () => {
		// getArticle()
	};

	onActivityClick = item => {
		this.props.navigation.navigate('ImpactActivityDetail', { activity: item });
	};

	renderItem = ({ item }) => {
		return (
			<TouchableOpacity style={styles.itemContainer} onPress={() => this.onActivityClick(item)}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View
						style={{
							flex: 2,
							backgroundColor: colors.transparent,
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Image source={item.icon} style={styles.imgBG} />
					</View>
					<View style={{ flex: 7, marginStart: 10, justifyContent: 'flex-start' }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<Text numberOfLines={1} style={{ marginEnd: 10, fontSize: 18, fontWeight: 'bold' }}>
								{item.name}
							</Text>
							<View style={styles.extraView}>
								<Feather style={{ marginStart: 10 }} name="plus" size={16} color={colors.green} />
								<Image source={bitgImageSource} style={styles.bitgImage} />
								<Text style={styles.rewardText}>{item.reward}</Text>
							</View>
						</View>

						<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Feather name="clock" size={14} color={colors.grey} />
								<Text style={{ fontSize: 14, marginStart: 5, color: colors.grey }}>
									{getParseDate(item.date)}
								</Text>
							</View>
						</View>
						<Text numberOfLines={3} style={{ fontSize: 14, marginTop: 5 }}>
							{item.description}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		const { level, error, loading, histories,week_reward,month_reward,older_reward } = this.state;

		return (
			<View style={styles.container}>
				<View style={styles.titleWrapper}>
					<View style={styles.titleWrapper1}>
						<Feather name="clock" size={14} color={colors.green} />
						<Text style={styles.titleText}>{strings('bitg_wallet.this_week')}</Text>
					</View>

					<View style={styles.rewardView}>
						<Image source={bitgImageSource} style={styles.totalBitgImage} />
						<Text style={styles.totalRewardText}>{week_reward}</Text>
					</View>
				</View>

				<FlatList
					refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh} />}
					style={{ margin: 10,height:150 }}
					data={histories}
					renderItem={this.renderItem}
					keyExtractor={item => item.id + ''}
				/>

				<View style={styles.titleWrapper}>
					<View style={styles.titleWrapper1}>
						<Feather name="clock" size={14} color={colors.green} />
						<Text style={styles.titleText}>{strings('bitg_wallet.this_month')}</Text>
					</View>

					<View style={styles.rewardView}>
						<Image source={bitgImageSource} style={styles.totalBitgImage} />
						<Text style={styles.totalRewardText}>{month_reward}</Text>
					</View>
				</View>

				<FlatList
					refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh} />}
					style={{ margin: 10,height:150 }}
					data={histories}
					renderItem={this.renderItem}
					keyExtractor={item => item.id + ''}
				/>
			</View>
		);
	}
}

const mapStateToProps = state => ({
	swapsTokens: state.engine.backgroundState.SwapsController.tokens,
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
	conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
	tokenExchangeRates: state.engine.backgroundState.TokenRatesController.contractExchangeRates,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency
});

export default connect(mapStateToProps)(ImpactHistory);
