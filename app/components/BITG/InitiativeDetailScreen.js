import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import {
    TouchableRipple
} from 'react-native-paper';


import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';
import { Snackbar, ProgressBar } from 'react-native-paper';
import { getEmptyHeaderOptions } from '../UI/Navbar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ToolBar from './ToolBar'

const headerImage = require("../../images/activity_header.png");

// const bitgImageSource = require('../../images/ic_bitg.png');

// const initiativeImageSource = require('../../images/ic_vibration_24px.png');
// const shopImageSource = require('../../images/ic_store_mall_directory_24px.png');


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
        width: 130,
        height: 100,
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
        color: colors.grey400,
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
    donateBITG: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },
    donateBITGTitle: {
        color: colors.tintColor,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    donateBitGText: {
        color: colors.grey400,
        marginBottom: 10,
    },
    donateAmountButtonContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }, 
    donateButton: {
        height: 45,
        width: 45,
        borderRadius: 25,
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    donateButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    donateOtherButton: {
        height: 45,
        width: 85,
        borderRadius: 25,
        borderColor: colors.tintColor,
        borderWidth: 2,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    donateOtherButtonText: {
        color: colors.tintColor,
        fontSize: 15,
        fontWeight: 'bold'
    },
    actionContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    actionItem: {
        width: 150,
        height: 150,
        marginHorizontal: 5,
        flexDirection: 'column',
        borderRadius: 10,
    },
    actionImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    actionText: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        bottom: 5,
    }
})


const data = {
    text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. \n\n Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.`,
}

const actions = [
    {
        key: 1,
        title: "Example Action",
        image: require("../../images/activity_header.png"),
    },
    {
        key:2,
        title: "Example Action",
        image: require("../../images/activity_header.png"),
    }
];

const donateAmounts = [10, 50, 100, 150];

function InitiativeDetailScreen(props) {

    const navigation = useContext(NavigationContext);

    const [type, setType] = useState(0);
    const [initiative, setInitiative] = useState(null);

    const onMenuPress = () => {
        navigation.pop()
    }

    useEffect(() => {
        // const { item } = route.params;

        const item = navigation.state.params.item;

        console.log('item:',item)

        if (item) {
            setInitiative(item);
            setType(!!item.subTitle && item.subTitle == "START FOLDING" ? 1 : item.subTitle == "KEEP CHANGING" ? 2 : item.subTitle == "EXPLORE" ? 3 : 1);
 		}
    
    }, []);


    const actionClicked = (action) => {
        // navigation.navigate(Routes.ACTION_SCREEN.TAG, {
        //     action: action
        // })
    }

    const actionButton = (text, type) => (
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => { 
            if (type == 0) { // START FOLDING
                
            } else if (type == 1) { // CONNECT SERVICE
                // navigation.navigate(Routes.SERVICES_SCREEN.TAG)
            }
        }}>
            <Text style={styles.actionButtonText}>{text}</Text>
        </TouchableOpacity>
    )

    const donateBITG = 
        <View style={styles.donateBITG}>
            <Text style={styles.donateBITGTitle}>DONATE BITG</Text>
            <Text style={styles.donateBitGText}> 
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text eve 
            </Text>
            <View style={styles.donateAmountButtonContainer}>
                {donateAmounts.map((amount, index) => (
                    <TouchableOpacity style={styles.donateButton} activeOpacity={0.7} key={index} onPress={() => { }}>
                        <Text style={styles.donateButtonText}>{amount}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.donateOtherButton} activeOpacity={0.7} onPress={() => { }}>
                    <Text style={styles.donateOtherButtonText}>OTHER</Text>
                </TouchableOpacity>
            </View>
        </View>
    
    const foldingView = 
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>{initiative?.description}</Text>
            {actionButton("START FOLDING", 0)}
            {donateBITG}
        </View>

    const chargingView = 
        <View style={[styles.bodyContainer, {
                justifyContent: 'space-between',
                marginBottom: 60
            }]
        }>
            <Text style={styles.bodyText}>{initiative?.description}</Text>
            {actionButton("CONNECT SERVICE", 1)}
        </View>

    const exploreView = 
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>{initiative?.description}</Text>
            <View style={styles.actionContainer}>
                {
                    actions.map((action, index) => (
                        <TouchableRipple style={styles.actionItem} onPress={() => actionClicked(action)} key={index}>
                            <ImageBackground source={action.image} imageStyle={{borderRadius:5}} style={styles.actionImage} >
                                {/* <Image source={action.image} style={styles.actionImage}/> */}
                                <Text style={styles.actionText}>{action.title}</Text>
                            </ImageBackground>
                        </TouchableRipple>
                    ))
                }
            </View>
            {donateBITG}
        </View>

    const bodyView = type == 1 ? foldingView : type == 2 ? chargingView : type == 3 ? exploreView : null;

    return (
        <View style={styles.container}>
            <ImageBackground source={ initiative? initiative.header :headerImage} style={styles.headerImage}>
                <ToolBar background={colors.transparent} iconName="arrow-back" onMenuPress={onMenuPress} />
                <View style={styles.headerContent}>
                    <Image style={styles.headerIcon} source={initiative && initiative.reverse} />    
                    <Text style={styles.headerText}>{(initiative && initiative.title !== 'Tesla') && initiative.title }</Text>
                </View>
            </ImageBackground>
            
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {bodyView}
            </ScrollView>
        </View>
    )
}


InitiativeDetailScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

InitiativeDetailScreen.propTypes = {
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

export default connect(mapStateToProps)(InitiativeDetailScreen);
