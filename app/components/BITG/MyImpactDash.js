import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';
import { Snackbar, ProgressBar } from 'react-native-paper';
import { getEmptyHeaderOptions } from '../UI/Navbar';

import ToolBar from './ToolBar'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	header: {
		margin: 20,
		marginTop:30,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent:'center',
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
	},
	buttonContainer:{
		marginHorizontal:20,
		backgroundColor:'red',
		flex:1,
    },
    buttonWrapper:{
        width:'30%',
        borderRadius:5,
        backgroundColor:colors.green,
        height:90,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonVibWrapper:{
        width:'30%',
        borderRadius:5,
        backgroundColor:colors.orange,
        height:90,
        justifyContent:'center',
        alignItems:'center'
	},
	buttonShopWrapper:{
        width:'30%',
        borderRadius:5,
        backgroundColor:colors.blue,
        height:90,
        justifyContent:'center',
        alignItems:'center'
	},
	buttonText:{
        marginTop:10,
        color:colors.white
	},
	buttonImage:{
        resizeMode:'contain',
        width: 30,
        height:30,
	},
	headerImage: {
        width:'100%',
        aspectRatio:1.6,
        alignSelf: 'stretch',
                
    },
    headerContent:{
        backgroundColor:'rgba(248,124,0,0.75)',
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    headerText: {
        fontSize: 30,
        color: colors.white
    },
    headerSubText: {
        fontSize: 14,
        color: colors.white
	},
	progressBar: {
        width: 200,
        height: 6,
        borderRadius: 3,
        marginTop: 5,
        marginStart: 5,
        backgroundColor: colors.progressColor
    },
});

const bitgImageSource = require('../../images/ic_bitg.png');
const impactImageSource = require('../../images/ic_stars_24px.png');
const initiativeImageSource = require('../../images/ic_vibration_24px.png');
const shopImageSource = require('../../images/ic_store_mall_directory_24px.png');

const headerImage = require("../../images/impact_header.png");

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
		level:5,
	};


	goToShopViews = () => {
		this.props.navigation.navigate('ShopScreen');
	}

	goToInitiativesViews = () => {
		this.props.navigation.navigate('ImpactInitiativesScreen');
	}


    onMenuPress = () => {
        this.props.navigation.toggleDrawer()
    }


	render() {


		const {
			level,
			error,
			loading,
		} = this.state;

		return (
			<View style={styles.container}>

				<ImageBackground source={headerImage} style={styles.headerImage}>
					<ToolBar
						background={colors.transparent}
						iconName="menu"
						onMenuPress={this.onMenuPress} />
					<View style={styles.headerContent}>
						<Text style={styles.headerSubText}>{strings('bitg_wallet.my_impact')}</Text>
						<ProgressBar
								style={styles.progressBar}
								progress={level === undefined ? 0 : level <= 8 ? level / 10 : 1}
								color={colors.white} />

						<Text style={styles.headerText}>{strings('bitg_wallet.my_impact')}</Text>
					</View>
				</ImageBackground>

				<View style={styles.header}>
					<View style={styles.buttonContainer}>
						<View style={styles.buttonContainer}>
								<TouchableOpacity style={styles.buttonVibWrapper} onPress={this.goToInitiativesViews}>
									<Image  source={initiativeImageSource} style={styles.buttonImage}/>
									<Text style={styles.buttonText}>{strings('bitg_wallet.initiatives')}</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.buttonShopWrapper}  onPress={this.goToShopViews}>
									<Image  source={shopImageSource} style={styles.buttonImage}/>
									<Text style={styles.buttonText}>{strings('bitg_wallet.shop')}</Text>
								</TouchableOpacity>
						</View>
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
				<TouchableOpacity style={styles.rewardsHistoryButton} activeOpacity={0.4}>
					<Text style={styles.rewardsHistoryText}>{strings('bitg_wallet.reward_history')}</Text>
				</TouchableOpacity>
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
