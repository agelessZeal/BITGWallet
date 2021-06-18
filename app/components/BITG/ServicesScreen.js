import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';
import { Snackbar, ProgressBar } from 'react-native-paper';
import { getEmptyHeaderOptions } from '../UI/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ToolBar from './ToolBar'

const headerImage = require("../../images/tesla_header.png");

const services = [
    {
        id: '1',
        title: 'Tesla',
        subTitle: 'CONNECT',
        icon: require("../../images/tesla-motors-1.png"),
        reverse: require("../../images/tesla_white.png"),
        header: require("../../images/tesla_header.png"),
        description:"This API integration is read-only, for the purposes of identifying your completed impact actions."
    },
    {
        id: '2',
        title: 'Earth Day Initiative',
        subTitle: 'CONNECT',
        icon: require("../../images/earth-day-initiative.png"),
        reverse :require("../../images/earth-day-initiative-inverse.png"),
        header: require("../../images/earth_header.png"),
        description:"This API integration is read-only, for the purposes of identifying your completed impact actions."
    },
];

const data = {
    text: `These API integrations are designed to be read-only, for the purposes of identifying your completed impact actions and subsequently rewarding you.`,
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    bodyText: {
        width: '100%',
        color: colors.grey500,
        marginBottom: 20,
    },
    headerImage: {
        // height: 300,
        // alignSelf: 'stretch',
        width:'100%',
        aspectRatio:1.6,
        alignSelf: 'stretch',
    },
    headerContent: {
		backgroundColor: 'rgba(0,234,0,0.35)',
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
    serviceContainer: { 
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    itemContainer: {
        width: Dimensions.get('window').width / 2 - 40,
        height: Dimensions.get('window').width / 2 - 40,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.grey100,
        borderRadius: 5,
        overflow: 'hidden',
        margin: 10,
    },
    itemImage: {
        width: 65,
        height: 65,
        alignSelf: 'center',
        resizeMode: "contain"
    },
    itemTitle: {
        marginTop: 15,
        textAlign: 'center',
        color: colors.blackColor,
        fontSize: 14
    },
    itemSubTitle: {
        marginTop: 5,
        textAlign: 'center',
        color: colors.tintColor,
        fontSize: 12,
        marginBottom: 10
    }
})

function ServicesScreen(props) {

    const navigation = useContext(NavigationContext);

    const onMenuPress = () => {
        navigation.pop()
    }

    const itemClicked = (service) => {
        // navigation.navigate(Routes.SERVICE_SCREEN.TAG, {
        //     service: service
        // })
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={headerImage} style={styles.headerImage}>
                <ToolBar background={colors.transparent} iconName="arrow-back" onMenuPress={onMenuPress} />
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}>{strings('bitg_wallet.services')}</Text>
                    <Text style={styles.headerSubText}>{strings('bitg_wallet.services_des')}</Text>
                </View>
            </ImageBackground>
            
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.serviceContainer}>
                    <Text style={styles.bodyText}>{data.text}</Text>
                    {services.map((item, index) => (
                        <TouchableRipple style={styles.itemContainer} onPress={() => itemClicked(item)} key={index}>
                            <View style={{ margin: 10 }}>
                                <Image style={styles.itemImage} source={item.icon} />
                                <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemSubTitle}>{item.subTitle}</Text>
                            </View>
                        </TouchableRipple>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}


ServicesScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

ServicesScreen.propTypes = {
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

export default connect(mapStateToProps)(ServicesScreen);
