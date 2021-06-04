import React,{useContext} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';

import { getBITGWalletNavbarOptions } from '../UI/Navbar';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	header: {
		margin: 20,
		paddingHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerLeftContainer: {
		height: 100,
		width: 100,
		backgroundColor: colors.tintColor
	},
	headerRightContainer: {
		flex: 1,
		alignItems: 'flex-end'
	},
	initiativesButton: {
		height: 50,
		width: 150,
		borderRadius: 25,
		backgroundColor: colors.tintColor,
		alignItems: 'center',
		justifyContent: 'center'
	},
	shopButton: {
		height: 50,
		width: 150,
		borderRadius: 25,
		marginTop: 10,
		backgroundColor: colors.tintColor,
		alignItems: 'center',
		justifyContent: 'center'
	},
	initiatives_text: {
		fontSize: 16,
		color: colors.white,
		padding: 10
	},
	shop_text: {
		fontSize: 16,
		color: colors.white,
		padding: 10
	},
	bitg: {
		marginTop: 40,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	totalRewards: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	thisWeek: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	totalRewardsText: {
		fontSize: 16,
		color: colors.grey
	},
	thisWeekText: {
		fontSize: 16,
		color: colors.grey
	},
	bitgSmallImage: {
		width: 30,
		height: 30,
		resizeMode: 'center'
	},
	rewardsHistoryButton: {
		height: 50,
		paddingStart: 20,
		paddingEnd: 20,
		borderRadius: 25,
		marginTop: 30,
		backgroundColor: colors.transparent,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: colors.tintColor,
		alignSelf: 'center'
	},
	rewardsHistoryText: {
		fontSize: 16,
		color: colors.tintColor,
		padding: 10,
		fontWeight: 'bold'
	}
});

const bitgImageSource = require('../../images/ic_bitg.png');

function MyImpactScreen({
	accounts,
	selectedAddress,
	balances,
	tokensWithBalance,
	tokensTopAssets,
	conversionRate,
	tokenExchangeRates,
	currentCurrency
}) {
	const navigation = useContext(NavigationContext);

	return (
		<View style={styles.container}>
			
			<View style={styles.header}>
				<View style={styles.headerLeftContainer} />
				<View style={styles.headerRightContainer}>
					<TouchableOpacity style={styles.initiativesButton} activeOpacity={0.7} onPress={() => {}}>
						<Text style={styles.initiatives_text}> {strings('bitg_wallet.initiatives')} </Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.shopButton} activeOpacity={0.7} onPress={() => {}}>
						<Text style={styles.shop_text}>{strings('bitg_wallet.shop')}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.bitg}>
				<View style={styles.totalRewards}>
					<Text style={styles.totalRewardsText}>{strings('bitg_wallet.total_reward')}</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						<Image style={styles.bitgSmallImage} source={bitgImageSource} />
						<Text style={{ fontSize: 40, color: colors.blackColor }}>124.30</Text>
					</View>
				</View>
				<View style={styles.thisWeek}>
					<Text style={styles.thisWeekText}>{strings('bitg_wallet.this_week')}</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						<Image style={styles.bitgSmallImage} source={bitgImageSource} />
						<Text style={{ fontSize: 40, color: colors.blackColor }}>22.05</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity
				style={styles.rewardsHistoryButton}
				activeOpacity={0.4}
			>
				<Text style={styles.rewardsHistoryText}>{strings('bitg_wallet.reward_history')}</Text>
			</TouchableOpacity>
		</View>
	);
}

MyImpactScreen.navigationOptions = ({ navigation }) => getBITGWalletNavbarOptions('bitg_wallet.my_impact', navigation);

MyImpactScreen.propTypes = {
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
	swapsTokens: state.engine.backgroundState.SwapsController.tokens,
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
	conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
	tokenExchangeRates: state.engine.backgroundState.TokenRatesController.contractExchangeRates,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency
});

export default connect(mapStateToProps)(MyImpactScreen);
