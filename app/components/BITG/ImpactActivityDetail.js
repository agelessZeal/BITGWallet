import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';
import { Snackbar, ProgressBar } from 'react-native-paper';
import { getEmptyHeaderOptions } from '../UI/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ToolBar from './ToolBar';

import Feather from 'react-native-vector-icons/Feather';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { getParseDate } from './lib/Helpers';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},

	header: {
		margin: 15,
		marginTop: 20,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flex:1,
		position:'relative',
	},
	headerText:{
		color:colors.white,
		fontSize:25
	},
	headerImage: {
		width: '100%',
		aspectRatio: 1.6,
		alignSelf: 'stretch'
	},
	headerContent: {
		backgroundColor: 'rgba(0,0,0,0.35)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemContainer: {
		flex: 1,
		flexDirection: 'column',
		overflow: 'hidden',
		borderBottomWidth: 10,
		borderColor: colors.white
	},
	imgBG: {
		width:150,
		resizeMode: 'contain'
	},
	bitgImage: {
		marginStart: 5,
		width: 14,
		height: 14,
		resizeMode: 'contain',
		marginStart:10,
	},
	extraView: {
		position:'absolute',
		top:0,
		right:10,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	rewardText: {
		color: colors.green,
		fontSize: 18,
		fontWeight: 'bold',
		marginStart:5,
	},
	mainContent: {
		margin: 15,
		marginTop: 20,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		flex:1,
		position:'relative',
	},
	mainTitle:{
		color:colors.blackColor,
		fontSize:18,
		fontWeight:'bold'
	},
	description:{
		fontSize:16,
		color:colors.grey300,
		marginTop:20,
		width:'100%'
	},
	shareContent:{
		marginTop:20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	shareIcon:{
		justifyContent: 'center',
		alignItems: 'center',
		flex:2,
	},
	shareTextWrapper:{
		flex:10,
	},
	shareNext:{
		flex:1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	shareTitle:{
		fontSize:16,
		color:colors.blackColor,

	},
	shareText:{
		marginTop:10,
		fontSize:14,
		color:colors.grey500,
	},
	positionWrapper:{
		marginTop:10,
		width:'50%',
		flexDirection:'row',
		alignItems:'center'
	},
	positionText:{
		fontSize:16,
		color:colors.blackColor,
		marginStart:10,
	}
	
});

const bitgImageSource = require('../../images/ic_bitg.png');

const initiativeImageSource = require('../../images/ic_vibration_24px.png');
const shopImageSource = require('../../images/ic_store_mall_directory_24px.png');

const headerImage = require('../../images/activity_header.png');

const impact_activity = {
	id: '1',
	name: 'Action 1',
	reward: 5.2,
	date: '8AM, Tues 6 Aug 2020',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
	icon: require('../../images/earth-day-initiative-inverse.png'),
	share:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
	position:'345 Some Lane Town, City, Country'
};


class ImpactActivityDetail extends PureComponent {
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
		activitiy: impact_activity
	};

	componentDidMount() {
		const pass_activity = this.props.navigation.getParam('activity', null);
		if(pass_activity){
			this.setState({
				activitiy:pass_activity
			})
		}
	}

	onBack = () => {
		this.props.navigation.goBack();
	};

	onShare = () => {


	}

	render() {
		const { level, error, loading, activitiy } = this.state;

		return (
			<View style={styles.container}>
				<ImageBackground source={headerImage} style={styles.headerImage}>
					<ToolBar background={colors.transparent} iconName="arrow-back" onMenuPress={this.onBack} />
					<View style={styles.headerContent}>

						<Image source={activitiy.icon} style={styles.imgBG} />
		
						<Text style={styles.headerText}>{activitiy.name}</Text>

						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Feather name="clock" size={14} color={colors.white} />
							<Text style={{ fontSize: 14, marginStart: 5, color: colors.white }}>
								{activitiy.date}
							</Text>
						</View>
					</View>
				</ImageBackground>
				

				<View style={styles.mainContent}>
					<Text numberOfLines={1} style={styles.mainTitle}>
						{activitiy.name}
					</Text>

					<View style={styles.positionWrapper}> 
					    <Icon name='location-arrow' size={13} color={colors.blackColor}/>
						<Text style={styles.positionText}>
							{activitiy.position}
						</Text>

					</View>

					<View style={styles.extraView}>
							<Feather style={{ marginStart: 10 }} name="plus" size={16} color={colors.green} />
							<Image source={bitgImageSource} style={styles.bitgImage} />
							<Text style={styles.rewardText}>{activitiy.reward}</Text>
					</View>


					<Text numberOfLines={6} style={styles.description}>
						{activitiy.description}
					</Text>

					<TouchableOpacity style={styles.shareContent} onPress={this.onShare}>
						<View style={styles.shareIcon}>
							<MaterialIcons name="share" size={34} color={colors.green} />
						</View>
						<View style={styles.shareTextWrapper}>
							<Text style={styles.shareTitle}>{strings('bitg_wallet.share_to_social')}</Text>
							<Text style={styles.shareText}>{activitiy.share}</Text>
						</View>

						<View style={styles.shareNext}>
							<MaterialIcons name="chevron-right" size={18} color={colors.green} />
						</View>
					</TouchableOpacity>
				</View>

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

export default connect(mapStateToProps)(ImpactActivityDetail);
