import React,{useContext} from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, Dimensions } from 'react-native';
import {
    TouchableRipple
} from 'react-native-paper';
import ToolBar from './ToolBar'

import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';


import { getEmptyHeaderOptions,getBITGWalletNavbarOptions } from '../UI/Navbar';


const headerImage = require("../../images/impact_header.png");

const initiatives = [
    {
        id: '1',
        title: 'Folding@Home',
        subTitle: 'START FOLDING',
        icon: require("../../images/folding-at-home-logo.png"),
        reverse: require("../../images/folding-at-home-logo.png"),
        header: require("../../images/folding_header.png"),
        description:"In such trying times, every way in which we can be of service to others counts. Folding@Home is one simple and effective way to be part of the solution \n\nBy downloading the software and linking up to the Folding@Home network, you volunteer the computing power of your desktop or laptop to a global effort to map out the proteins of the Corona Virus – a crucial step towards finding the vaccine. Folding@Home costs nothing and requires little more than running the software in the background."
    },
    {
        id: '2',
        title: 'Tesla',
        subTitle: 'KEEP CHANGING',
        icon: require("../../images/tesla-motors-1.png"),
        reverse: require("../../images/tesla_white.png"),
        header: require("../../images/tesla_header.png"),
        description:"Tesla stands a beacon of change in the automotive world—and introduced iconic electric vehicles over the past decade. BitGreen supports this innovation and pledges: \n\nWhen you recharge your ride, We recharge the planet'\n\nFor every 2 full charges, we donate BITG, The Nature Conservancy plants a tree."
    },
    {
        id: '3',
        title: 'Earth Day Initiative',
        subTitle: 'EXPLORE',
        icon: require("../../images/earth-day-initiative.png"),
        reverse :require("../../images/earth-day-initiative-inverse.png"),
        header: require("../../images/earth_header.png"),
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        id: '4',
        title: 'The Nature Conservancy',
        subTitle: 'EXPLORE',
        icon: require("../../images/tnc-logo.png"),
        reverse :require("../../images/tnc_white.png"),
        header: require("../../images/earth_header.png"),
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        id: '5',
        title: 'Dashboard.Earth',
        subTitle: 'EXPLORE',
        icon: require("../../images/dash_earth.png"),
        reverse :require("../../images/tnc_white.png"),
        header: require("../../images/earth_header.png"),
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
];


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
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
        fontSize: 16,
        color: colors.white
    },
    initiativeContainer: { 
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    currentInitiative:{
        marginStart:30,
        marginTop:10,
        color:colors.green,
        ...fontStyles.normal,
		fontSize: 15,
		textTransform: 'uppercase'

    },
    cardStyle: {
        width: Dimensions.get('window').width / 2 - 40,
        height: Dimensions.get('window').width / 2 - 40,
        borderWidth: 1,
        borderColor: colors.grey200,
        borderRadius: 5,
        overflow: 'hidden',
        margin: 10,
    },
    itemContainer: {
        flex: 1, 
        marginVertical: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemImage: {
        width: 100,
        height: 60,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginTop: 5,
    },
    itemTitle: {
        textAlign: 'center',
        color: colors.blackColor,
        fontSize: 14
    },
    itemSubTitle: {
        marginTop: 5,
        textAlign: 'center',
        color: colors.tintColor,
        fontSize: 12,
    }
})

function ImpactInitiativesScreen({ 
    accounts,
	selectedAddress,
	balances,
	tokensWithBalance,
	tokensTopAssets,
	conversionRate,
	tokenExchangeRates,
	currentCurrency }) {

    const navigation = useContext(NavigationContext);

    const onMenuPress = () => {
        navigation.toggleDrawer()
    }

    const itemClicked = (item) => {
        navigation.navigate('InitiativeDetail', {item})
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={headerImage} style={styles.headerImage}>
                <ToolBar
                    background={colors.transparent}
                    iconName="menu"
                    onMenuPress={onMenuPress} />
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}>{strings('bitg_wallet.impact_initiatives')}</Text>
                    <Text style={styles.headerSubText}>{strings('bitg_wallet.impact_learn_more')}</Text>
                </View>
            </ImageBackground>
            
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.currentInitiative}>{strings('bitg_wallet.current_initiatives')}</Text>
                <View style={styles.initiativeContainer}>
                    {initiatives.map((item, index) => (
                        <TouchableRipple style={styles.cardStyle} onPress={() => itemClicked(item)} key={index}>
                            <View style={styles.itemContainer}>
                                <Image style={styles.itemImage} source={item.icon} />
                                <View style={{ marginHorizontal: 5, marginBottom: 5 }}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemSubTitle}>{item.subTitle}</Text>
                                </View>
                            </View>
                        </TouchableRipple>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

ImpactInitiativesScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

ImpactInitiativesScreen.propTypes = {
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

export default connect(mapStateToProps)(ImpactInitiativesScreen);

