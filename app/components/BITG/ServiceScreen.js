import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TextInput, TouchableOpacity } from 'react-native';

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

const data = {
    text: `This API integration is read-only, for the purpose of identifying your completed impact actions`,
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    bodyText: {
        width: '100%',
        color: colors.grey400,
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
		backgroundColor: 'rgba(234,0,0,0.75)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
    },

    headerIcon: {
        marginTop:10,
        width: 120,
        height: 120,
        alignSelf: 'center',
        resizeMode: 'contain'
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
        flexGrow: 1,
        marginTop: 20,
        marginHorizontal: 20,
    },
    tokenContainer: {
        backgroundColor: 'black'
    },
    tokenInputText: {
        fontSize: 13, 
        marginVertical: 10,
        color: colors.tintColor
    },
    tokenInput: {
        height: 45,
        backgroundColor: colors.light_gray,
        padding: 10,
        fontSize: 12,
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    actionButton: {
        height: 45,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        marginHorizontal: 5,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: colors.tintColor,

    },
    actionButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textTransform:'uppercase'
    },
})

function ServiceScreen(props) {

    const navigation = useContext(NavigationContext);

    const [service, setService] = useState();
    const [token, setToken] = useState();

    const onMenuPress = () => {
        navigation.pop()
    }

    const learnBtnClicked = () => {
        // TODO
    }

    const authorizeBtnClicked = () => {
        // TODO 
    }

    useEffect(() => {
        const data = navigation.state.params.service;

        if (data) {
            setService(data);
        }

    }, []);


    const tokenFieldChanged = (text) => {
        setToken(text);
    }

    const actionButton = (text) => (
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => {
         }}>
            <Text style={styles.actionButtonText}>{text}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <ImageBackground source={service? service.header:headerImage} style={styles.headerImage}>
                <ToolBar background={colors.transparent} iconName="arrow-back" onMenuPress={onMenuPress} />
                <View style={[styles.headerContent,service?.title === 'Tesla' ? { backgroundColor:'rgba(234,0,0,0.75)'} :  { backgroundColor:'rgba(2,234,0,0.35)'}]}>
                    <Image style={styles.headerIcon} source={service && service.reverse} />
                    <Text style={styles.headerText}>{(service && service.title !== 'Tesla') && service.title }</Text>
                    <Text style={styles.headerSubText}>{strings('bitg_wallet.connect_service')}</Text>
                </View>
            </ImageBackground>
            
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.serviceContainer}>
                    <Text style={styles.bodyText}>{service && service.description}</Text>
                    <Text style={styles.tokenInputText}>{strings('watch_asset_request.token')}</Text>
                    <TextInput
                        style={styles.tokenInput}
                        placeholder={strings('bitg_wallet.token_hint')}
                        placeholderTextColor={colors.grey200}
                        onChangeText={tokenFieldChanged}
                        defaultValue={token === undefined ? "" : token}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.white }]} activeOpacity={0.7} onPress={() => {learnBtnClicked}}>
                            <Text style={[styles.actionButtonText, { color: colors.tintColor }]}>{strings('manual_backup_step_3.learn')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.tintColor }]} activeOpacity={0.7} onPress={() => {authorizeBtnClicked}}>
                            <Text style={[styles.actionButtonText, {color: colors.white }]}>{strings('bitg_wallet.authorize')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
ServiceScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

ServiceScreen.propTypes = {
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

export default connect(mapStateToProps)(ServiceScreen);