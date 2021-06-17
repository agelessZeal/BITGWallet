import React, { PureComponent } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ImageBackground,
	FlatList,
	RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';
import { Snackbar, ProgressBar } from 'react-native-paper';
import { getEmptyHeaderOptions } from '../UI/Navbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToolBar from './ToolBar';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


import {getParseDate} from './lib/Helpers'


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	header: {
		margin: 15,
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row'
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
		marginTop: 10,
		alignItems: 'flex-start',
		justifyContent: 'space-around'
	},
	totalRewards: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	thisWeek: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	totalRewardsText: {
		fontSize: 14,
		color: colors.grey500,
		textAlign: 'left'
	},
	thisWeekText: {
		fontSize: 14,
		color: colors.grey500,
		textAlign: 'left'
	},
	bitgBalanceText: {
		fontSize: 30,
		color: colors.blackColor
	},
	bitgSmallImage: {
		width: 20,
		height: 20,
		resizeMode: 'contain'
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
	},
	buttonContainer: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center'
	},
	buttonVibWrapper: {
		width: 90,
		borderRadius: 5,
		backgroundColor: colors.orange,
		height: 90,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 5
	},
	buttonShopWrapper: {
		width: 90,
		borderRadius: 5,
		backgroundColor: colors.blue,
		height: 90,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 5
	},
	buttonText: {
		marginTop: 10,
		color: colors.white
	},
	buttonImage: {
		resizeMode: 'contain',
		width: 30,
		height: 30
	},
	headerImage: {
		width: '100%',
		aspectRatio: 1.6,
		alignSelf: 'stretch'
	},
	headerContent: {
		backgroundColor: 'rgba(248,124,0,0.75)',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	headerText: {
		marginTop: 10,
		fontSize: 28,
		color: colors.white,
		marginBottom: 15
	},
	headerSubText: {
		fontSize: 14,
		color: colors.white
	},
	progressBar: {
		width: 130,
		height: 6,
		borderRadius: 3,
		marginTop: 5,
		marginStart: 5,
		backgroundColor: 'rgba(248,224,160,0.55)'
	},
	shield: {
		position: 'relative'
	},
	shieldText: {
		fontSize: 35,
		color: colors.orange,
		position: 'absolute',
		top: 15,
		left: 25,
		justifyContent: 'center',
		alignItems: 'center'
	},
	smallShieldText: {
		fontSize: 27,
		color: colors.white,
		position: 'absolute',
		top: 10,
		left: 17,
		justifyContent: 'center',
		alignItems: 'center'
	},
	moreText: {
		fontSize: 13,
		color: colors.grey500
	},
	moreText2: {
		fontSize: 13,
		color: colors.orange
	},
	recentText: {
		marginHorizontal: 20,
		marginTop: 15,
		color: colors.green,
		fontSize: 16,
		textTransform: 'uppercase'
	},
	itemContainer: {
		flex: 1,
		flexDirection: 'column',
		overflow: 'hidden',
		paddingBottom:10,
		borderBottomWidth: 1,
		borderColor: colors.grey000,
		marginTop:10,
	},
	imgBG: {
		width:'90%',
		resizeMode: 'contain'
	},
	// imgBG: {
	// 	width: 50,
	// 	height: 50,
	// 	borderRadius: 25,
	// 	resizeMode: 'cover'
    // },
    bitgImage:{
		marginStart:5,
        width:12,
        height:12,
        resizeMode:'contain'
	},
	extraView:{
        flexDirection: 'row',
        justifyContent:'space-around',
		alignItems:'center',
		marginEnd:10,
	},
	rewardText:{
		color:colors.green,
		fontSize:16,
		fontWeight:'400',

	}
});

const bitgImageSource = require('../../images/ic_bitg.png');

const initiativeImageSource = require('../../images/ic_vibration_24px.png');
const shopImageSource = require('../../images/ic_store_mall_directory_24px.png');

const headerImage = require('../../images/impact_header.png');

const impact_activities = [
	{
		id: '1',
		name: 'Action 1',
		reward: 5.2,
		date: "June 12 2011",
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		icon: require('../../images/earth-day-initiative-inverse.png'),
		share:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		position:'345 Some Lane Town, City, Country'
	},
	{
		id: '2',
		name: 'Action 2',
		reward: 2.2,
		date:"June 12 2011",
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		icon: require('../../images/earth-day-initiative-inverse.png'),
		share:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		position:'345 Some Lane Town, City, Country'
	},
	{
		id: '3',
		name: 'Action 3',
		reward: 3.2,
		date: "June 12 2011",
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
		icon: require('../../images/earth-day-initiative-inverse.png'),
		share:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		position:'345 Some Lane Town, City, Country'
	}
];

class MyImpactDash extends PureComponent {
	static navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

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
		level: 3,
		total_reward: 124.31,
		week_reward: 22.05,
		activities: impact_activities
	};

	goToShopViews = () => {
		this.props.navigation.navigate('ShopScreen');
	};

	goToInitiativesViews = () => {
		this.props.navigation.navigate('ImpactInitiativesScreen');
	};

	onMenuPress = () => {
		this.props.navigation.toggleDrawer();
	};

	onActivityClick = item => {
		console.log(item,'as')
		this.props.navigation.navigate('ImpactActivityDetail',{activity:item})
	};

	onRefresh = () => {
		// getArticle()
	};

	renderItem = ({ item }) => {

		return (
			<TouchableOpacity style={styles.itemContainer} onPress={() => this.onActivityClick(item)}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ flex: 2, backgroundColor: colors.transparent ,justifyContent:'center',alignItems:'center'}}>
						<Image source={item.icon} style={styles.imgBG} />
					</View>
					<View style={{ flex: 7, marginStart: 10, justifyContent: 'flex-start' }}>

						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<Text numberOfLines={1} style={{ marginEnd: 10, fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
							<View style={styles.extraView}>
								<Feather style={{ marginStart: 10}} name="plus" size={16} color={colors.green} />
								<Image source={bitgImageSource} style={styles.bitgImage}/>
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
		const { level, error, loading, total_reward, week_reward, activities } = this.state;

		return (
			<View style={styles.container}>
				<ImageBackground source={headerImage} style={styles.headerImage}>
					<ToolBar background={colors.transparent} iconName="menu" onMenuPress={this.onMenuPress} />
					<View style={styles.headerContent}>
						<View style={styles.shield}>
							<MaterialCommunityIcons name="shield" size={70} color={colors.white} />
							<Text style={styles.shieldText}>{level}</Text>
						</View>

						<Text style={styles.headerSubText}>{strings('bitg_wallet.level', { level: level })}</Text>
						<ProgressBar
							style={styles.progressBar}
							progress={level === undefined ? 0 : level <= 8 ? level / 10 : 1}
							color={colors.white}
						/>

						<Text style={styles.headerText}>{strings('bitg_wallet.my_impact')}</Text>
					</View>
				</ImageBackground>

				<View style={styles.header}>
					<View style={styles.bitg}>
						<View style={styles.totalRewards}>
							<Text style={styles.totalRewardsText}>{strings('bitg_wallet.total_reward')}</Text>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<Image style={styles.bitgSmallImage} source={bitgImageSource} />
								<Text style={styles.bitgBalanceText}>{total_reward}</Text>
							</View>
						</View>
						<View style={styles.thisWeek}>
							<Text style={styles.thisWeekText}>{strings('bitg_wallet.this_week')}</Text>
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<Image style={styles.bitgSmallImage} source={bitgImageSource} />
								<Text style={styles.bitgBalanceText}>{week_reward}</Text>
							</View>
						</View>
					</View>

					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.buttonVibWrapper} onPress={this.goToInitiativesViews}>
							<Image source={initiativeImageSource} style={styles.buttonImage} />
							<Text style={styles.buttonText}>{strings('bitg_wallet.initiatives')}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttonShopWrapper} onPress={this.goToShopViews}>
							<Image source={shopImageSource} style={styles.buttonImage} />
							<Text style={styles.buttonText}>{strings('bitg_wallet.shop')}</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.header}>
					<View style={styles.shield}>
						<MaterialCommunityIcons name="shield" size={50} color={colors.orange} />
						<Text style={styles.smallShieldText}>{level}</Text>
					</View>

					<Text style={styles.moreText} numberOfLines={2}>
						Complete 3 more{'\n'}actions to progress
					</Text>

					<Text style={styles.moreText2} numberOfLines={2}>
						Great Work! You're in the {'\n'}top 10% of users
					</Text>
				</View>

				<Text style={styles.recentText}>{strings('bitg_wallet.recent_activity')}</Text>

				<FlatList
					refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh} />}
					style={{ margin: 10 }}
					data={activities}
					renderItem={this.renderItem}
					keyExtractor={item => item.id + ''}
				/>

				{/* <TouchableOpacity style={styles.rewardsHistoryButton} activeOpacity={0.4}>
					<Text style={styles.rewardsHistoryText}>{strings('bitg_wallet.reward_history')}</Text>
				</TouchableOpacity> */}
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

export default connect(mapStateToProps)(MyImpactDash);
