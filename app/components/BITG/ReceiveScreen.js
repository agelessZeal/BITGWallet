import React,{useEffect,useCallback,useState,useContext} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Clipboard from "@react-native-community/clipboard";


import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { getBITGWalletNavbarOptions } from '../UI/Navbar';

import Share from 'react-native-share'; // eslint-disable-line  import/default

const walletImageSource = require("../../images//bitg_wallet.png");


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    walletImage: {
        width: 66,
        height: 61,
        marginTop: 60,
        alignSelf: 'center'
    },
    walletTitle: {
        alignSelf: 'center',
        marginTop: 20,
        color: colors.grey500,
        fontSize: 18
    },
    walletAddress: {
        marginTop: 10,
        color: colors.blackColor,
        fontSize: 25,
        marginStart: 20,
        marginEnd: 20,
        textAlign: 'center',
        alignSelf: 'center'
    },
    walletDescription: {
        alignSelf: 'center',
        marginTop: 20,
        color: colors.grey500,
        fontSize: 18,
        marginStart: 20,
        marginEnd: 20,
        textAlign:'left'
    },
    buttonContainer: {
        marginStart: 20,
        marginEnd: 20,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 30
    },
    copyButton: {
        height: 50,
        width: 150,
        borderRadius: 25,
        backgroundColor: colors.transparent,
        borderWidth: 2,
        borderColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    shareButton: {
        height: 50,
        width: 150,
        borderRadius: 25,
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    copyText: {
        fontSize: 16,
        color: colors.tintColor,
        padding: 10
    },
    shareText: {
        fontSize: 16,
        color: colors.white,
        padding: 10
    }
})

function ReceiveScreen({ 	
    accounts,

	selectedAddress,

	balances,

	conversionRate,

    currentCurrency,

	tokenExchangeRates }) {

    const [myWallet, setMyWallet] = useState(selectedAddress)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        // const wallet = WalletManager.getWalletByName("BITGWallet")
        // setMyWallet(wallet.getKey(0).getAddress())
    }, []);

    const copyToClipboard = () => {
        if (myWallet != undefined && myWallet != null) {
            setShowModal(true)
            setTimeout(() => {
                Clipboard.setString(myWallet)
                setShowModal(false)
            }, 2000);
        } else {
            showAlert("You don't have any wallet address!")
        }
    }

    const onShare = async () => {
        if (myWallet != undefined && myWallet != null) {
            // try {
            //     await Share.share({
            //         title: 'React Native Share',
            //         message: myWallet,
            //     });

            // } catch (error) {
            //     console.log(error.message);
            // }

            Share.open({
                message: myWallet
            }).catch(err => {
                Logger.log('Error while trying to share payment request', err);
            });

        } else {
            showAlert("You don't have any wallet address!")
        }
    };

    const onMenuPress = () => {
        route.params === undefined ? navigation.toggleDrawer() : navigation.pop()
    }

    return (
        <View style={styles.container}>
            <Image style={styles.walletImage} source={walletImageSource} />
            <Text style={styles.walletTitle}>{strings('bitg_wallet.my_wallet_address')}</Text>
            <Text style={styles.walletAddress}>{myWallet}</Text>
            <Text style={styles.walletDescription}>{strings('bitg_wallet.my_wallet_description')}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.copyButton} activeOpacity={0.3} onPress={copyToClipboard}>
                    <Text style={styles.copyText}>{strings('bitg_wallet.copy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton} activeOpacity={0.6} onPress={onShare}>
                    <Text style={styles.shareText}>{strings('bitg_wallet.share')}</Text>
                </TouchableOpacity>
            </View>
            <Snackbar visible={showModal}>
                You successfully copied the address!
            </Snackbar>
        </View >
    );
}


ReceiveScreen.navigationOptions = ({ navigation }) =>  getBITGWalletNavbarOptions('bitg_wallet.receive_title',navigation);

ReceiveScreen.propTypes = {
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

export default connect(mapStateToProps)(ReceiveScreen);
