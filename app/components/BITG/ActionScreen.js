import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';


import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';
import { Snackbar, ProgressBar } from 'react-native-paper';
import { getEmptyHeaderOptions } from '../UI/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ToolBar from './ToolBar'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    headerImage: {
        // height: 300,
        // alignSelf: 'stretch',
        width:'100%',
        aspectRatio:1.6,
        alignSelf: 'stretch',
    },
    headerContent: {
		backgroundColor: 'rgba(0,0,0,0.35)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
    },

    headerIcon: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    headerText: {
        fontSize: 28,
        color: colors.white
    },
    headerSubText: {
        fontSize: 16,
        color: colors.white
    },
    bodyContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    bodyText: {
        width: '100%',
        color: colors.grey,
        marginVertical: 20,
    },
    actionButton: {
        height: 45,
        width: 170,
        borderRadius: 25,
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
})

const headerImage = require("../../images/activity_header.png");
const actionImage = require("../../images/earth-day-initiative-inverse.png");

const data = {
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. \n\n Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.`,
}

function ActionScreen(props) {

    const navigation = useContext(NavigationContext);

    const [action, setAction] = useState();

    const onMenuPress = () => {
        navigation.goBack()
    }

    useEffect(() => {

        const data = navigation.state.params.action;

        console.log('action:',data)
        if (data) {
            setAction(data);
         }
    }, []);

    const goToService = () => {
        navigation.navigate("ServicesScreen")
    }

    const actionButton = (text) => (
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={goToService}>
            <Text style={styles.actionButtonText}>{text}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <ImageBackground source={headerImage} style={styles.headerImage}>
                <ToolBar background={colors.transparent} iconName="arrow-back" onMenuPress={onMenuPress} />
                <View style={styles.headerContent}>
                    <Image style={styles.headerIcon} source={action && action.header} />       
                    <Text style={styles.headerText}>{action && action.title}</Text>
                </View>
            </ImageBackground>
            
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={[styles.bodyContainer, {
                        justifyContent: 'space-between',
                        marginBottom: 60
                    }]
                }>
                    <Text style={styles.bodyText}>{action && action?.description}</Text>
                    {actionButton("CONNECT SERVICE")}
                </View>
            </ScrollView>
        </View>
    )
}


ActionScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

ActionScreen.propTypes = {
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

export default connect(mapStateToProps)(ActionScreen);
