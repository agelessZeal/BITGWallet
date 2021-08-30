import React, { useEffect, useCallback, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity, ScrollView, Dimensions, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    TouchableRipple,
    ProgressBar
} from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";
import NetInfo from "@react-native-community/netinfo";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';

import { getBITGWalletNavbarOptions } from '../UI/Navbar';
import { toFixedFloor } from './lib/Helpers'
import AssetElement from '../UI/AssetElement';
import NetworkMainAssetLogo from '../UI/NetworkMainAssetLogo';
import TokenImage from '../UI/TokenImage'
import { renderFromWei, weiToFiat, hexToBN, getCurrencySymbol, toBN } from '../../util/number';
import moment from 'moment'

import BITGAccountOverview from './BITGAccountOverview'
import {
    setSwapsHasOnboarded,
    setSwapsLiveness,
    swapsHasOnboardedSelector,
    swapsTokensWithBalanceSelector,
    swapsTopAssetsSelector
} from '../../reducers/swaps';
import axios from 'axios';
import AppConstants from '../../core/AppConstants'
import { BN_ONE, BN_TEN, formatBalance, isBn, isUndefined, BN_ZERO, BN_TWO, bnToBn } from '@polkadot/util'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    balanceContainer: {
        flexDirection: 'row',
        marginTop: 5,
        marginStart: 20,
        marginEnd: 20
    },
    bitgImage: {
        width: 43,
        height: 60,
        resizeMode: "contain"
    },
    bitgSmallImage: {
        width: 25,
        height: 25,
        marginStart: 20,
        marginBottom: 10,
        resizeMode: "contain",
        alignSelf: 'flex-end',
        ...Platform.select({ ios: { tintColor: colors.blackColor } })
    },
    usdSmallImage: {
        marginStart: 20,
        marginBottom: 7,
        alignSelf: 'flex-end',
    },
    balanceText: {
        color: colors.grey400,
        fontSize: 12,
        marginStart: 20
    },
    bitgContainer: {
        flexDirection: 'row',
    },
    usdContainer: {
        paddingStart: 20,
        flexDirection: 'row',
    },
    bitgText: {
        fontSize: 35,
        color: colors.blackColor,
        marginStart: 5
    },
    usdText: {
        fontSize: 35,
        color: colors.grey,
        marginStart: 5
    },
    bitgButton: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginStart: 10
    },
    usdButton: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginStart: 10
    },
    transactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginStart: 20,
        marginEnd: 20,
    },
    textDays: {
        fontSize: 16,
        color: colors.grey,
        marginStart: 10
    },
    textTransaction: {
        fontSize: 16,
        color: colors.tintColor,
        padding: 8
    },
    transactionButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    graphView: {
        marginStart: 20,
        marginEnd: 20,
        alignSelf: 'stretch',
        height: 150,
        backgroundColor: colors.tintColor
    },
    progressBar: {
        marginStart: 20,
        marginEnd: 20,
        alignSelf: 'stretch',
        height: 10,
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: colors.progressColor
    },
    inExContainer: {
        marginStart: 20,
        marginEnd: 20,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    incomeText: {
        fontSize: 12,
        color: colors.grey,
    },
    expenseText: {
        fontSize: 12,
        color: colors.grey,
    },
    inExText: {
        fontSize: 16,
        marginStart: 5,
        color: colors.blackColor,
    },
    sendReceiveContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    latestFromBitgButton: {
        height: 70,
        flex: 1,
        borderRadius: 5,
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center'
    },
    receiveButton: {
        height: 50,
        width: 150,
        borderRadius: 25,
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    latestFromBitgText: {
        fontSize: 20,
        color: colors.white,
        padding: 10
    },
    receiveText: {
        fontSize: 16,
        color: colors.white,
        padding: 10
    },
    errorWalletContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorWalletText: {
        fontSize: 18,
        color: colors.redColor,
        textAlign: 'center'
    },
    buttonContainer: {
        marginHorizontal: 20,
    },
    buttonWrapper: {
        width: '30%',
        borderRadius: 5,
        backgroundColor: colors.green,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonVibWrapper: {
        width: '30%',
        borderRadius: 5,
        backgroundColor: colors.orange,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonShopWrapper: {
        width: '30%',
        borderRadius: 5,
        backgroundColor: colors.blue,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonImage: {
        resizeMode: 'contain',
        width: 30,
        height: 30,
    },
    buttonText: {
        marginTop: 10,
        color: colors.white
    },
    impactWrapper: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: colors.grey000
    },
    impactItem: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: colors.white,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
        borderColor: colors.grey050,
        borderWidth: 1,
        borderRadius: 5,
        position: 'relative'
    },
    impactItemClose: {
        position: 'absolute',
        right: 6,
        top: 6,
    },
    impactItemStarWrapper: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 7,
    },
    impactItemStar: {
        tintColor: colors.blue,
        width: 25,
        height: 25,
    },
    impactItemTitle: {
        justifyContent: 'space-around'
    },
    impactText1: {
        color: colors.grey200
    },
    impactText2: {
        color: colors.black,
        maxWidth: Dimensions.get("window").width - 95,
    },
    balances: {
        flex: 1,
        justifyContent: 'center'
    },
    balance: {
        fontSize: 16,
        color: colors.fontPrimary,
        ...fontStyles.normal,
        // textTransform: 'uppercase',
        // fontWeight:'bold'
    },
    
    balanceFiat: {
        fontSize: 12,
        color: colors.fontSecondary,
        ...fontStyles.normal,
        textTransform: 'uppercase'
    },
    balanceFiatTokenError: {
        textTransform: 'capitalize'
    },
    ethLogo: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        marginRight: 20
    }
})

const bitgImageSource = require("../../images/ic_bitg.png");
const impactImageSource = require("../../images/ic_stars_24px.png");
const initiativeImageSource = require("../../images/ic_vibration_24px.png");
const shopImageSource = require("../../images/ic_store_mall_directory_24px.png");
const dummy_impact = [
    {
        id: 1,
        title: 'Name',
        time: '5 min ago',
        content: 'New impact news, from bitg'
    },
    // {
    //     id:2,
    //     title: 'Name s',
    //     time: '1 hour ago',
    //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
    // }
]

function MyWalletScreen({
    swapsTokens,
    accounts,
    selectedAddress,
    balances,
    identities,
    tokensWithBalance,
    tokensTopAssets,
    conversionRate,
    tokenExchangeRates,
    currentCurrency,
    userHasOnboarded,
    setHasOnboarded,
    api,
    setLiveness }) {

    const navigation = useContext(NavigationContext);
    const initialSource = navigation.getParam('sourceToken', "SWAPS_ETH_ADDRESS");

    const [loading, setLoading] = useState(false);
    // const { state } = useContext(TransactionContext)
    // const walletContext = useContext(WalletContext)

    const [availableBalance, setAvailableBalance] = useState({
        balance: 0,
        balanceFiat: 0
    });

    const [mybalance, setMyBalance] = useState(0)

    const [expense, setExpense] = useState(0)
    const [income, setIncome] = useState(0)
    const [history, setHistory] = useState([])

    const [tokenBalance, setTokenBalance] = useState(0)

    const [tokenMeta, setTokenMeta] = useState(null)
    const [tokenAsset, setTokenAsset] = useState(null)



    useEffect(() => {
        async function fetchData(address) {
            try {
                const dts = moment().subtract(30, 'days').format()
                // console.log('dts:',dts)

                const response = await axios.get(`${AppConstants.TRANSACTION_QUERY_API}transactions?account=${address}&dts=${dts}`);

                if (!response) {
                    console.log('query empty response:');
                } else {
                    if (response && response.data && response.data.transactions) {
                        // setTransactions(response.data.transactions)
                        const res = response.data.transactions;
                        let added = 0;
                        let loss = 0;

                        let balances = []
                        res.reverse().map((item, index) => {
                            const is_reward = item.sender === ''
                            const is_expense = item.sender === selectedAddress

                            const itemAmount = item.amount.toLocaleString().replace(/,/g, '');

                            const parsed = isNaN(renderFromWei(toBN(itemAmount))) ? '0' : renderFromWei(toBN(itemAmount));

                            const amount = is_expense ? -parseFloat(parsed) : parseFloat(parsed);

                            if (is_expense) {
                                loss += parseFloat(amount)
                            } else {
                                added += parseFloat(amount)
                            }

                            balances.push(amount)

                        })

                        if (balances.length === 1) {
                            balances.unshift(0)
                        }
                        setGraphData(balances)
                        setIncome(added)
                        setExpense(Math.abs(loss))
                    }
                }
            } catch (error) {
                console.log('query error:', error);
                setLoading(false)
            }
        }

        if (selectedAddress) {
            fetchData(selectedAddress)
        }
    }, [selectedAddress, mybalance]);

    useEffect(() => {
        try {
            if (accounts && accounts[selectedAddress] && accounts[selectedAddress].balance) {
                const balance = renderFromWei(accounts[selectedAddress].balance, 3);
                let balanceFiat = weiToFiat(hexToBN(accounts[selectedAddress].balance), conversionRate, currentCurrency);

                if (balance === '0') {
                    balanceFiat = getCurrencySymbol(currentCurrency) + ' 0'
                }

                setAvailableBalance({
                    balance,
                    balanceFiat
                })
                setMyBalance(balance)
            }

        } catch (e) {
            console.log('calc balance error:', e)
        }
    },
        [
            accounts, selectedAddress
        ])

    useEffect(() => {

        async function getTokenBalance() {
            try {
                if (api) {
                    const tokenInfo = await api.query.assets.asset(1);
                    const metaInfo = await api.query.assets.metadata(1);
                    setTokenMeta(metaInfo)
                    console.log('token metadata:', tokenInfo, metaInfo)
                    const amount = await api.query.assets.account(1, selectedAddress);

                    const asset = { logo: '', address: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', name:metaInfo.name,symbol:metaInfo.symbol,balance: amount.balance, balanceFiat: 0 };
                    setTokenAsset(asset)
                    // console.log('amount:',amount,amount.balance,asset)

                    // console.log('main wallet screen token', token)
                    setTokenBalance(amount.balance)

                    
                }
            } catch (error) {
                console.log('query error:', error);
            }
        }

        
        getTokenBalance()
    }, [selectedAddress])

    const [periodDays, setPeriodDays] = useState(30);
    const [graphData, setGraphData] = useState([]);


    const [impactData, setImpactData] = useState(dummy_impact);


    const onRefresh = async () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                (async () => {
                    setLoading(true)
                    setLoading(false)
                })();
            }
        })
    }


    const getBalancePoints = (dataPoints, periodDays = 1, currentBalance = 0) => {
        let result = [];
        let runningBalance = currentBalance;
        let groomedDataPoints = dataPoints.sort((a, b) => b.time - a.time)
            .filter(dataPoint => dataPoint.time > (Date.now() - periodDays * 24 * 60 * 60 * 1000) / 1000);
        result.push(runningBalance)
        for (let point of groomedDataPoints) {
            runningBalance += point.send_amount * (point.is_expense ? 1 : -1);
            result.push(runningBalance)
        }

        if (result.length === 1)
            result.push(result[0])

        return result.reverse();
    }

    const getGraphWidth = (containerWidth, pointCount) => {

        let multiplierList = [1, 1, 1.7, 1.3, 1.15, 1.05];
        let multiplier = pointCount < multiplierList.length ? multiplierList[pointCount] : 1;

        return containerWidth + containerWidth / pointCount * multiplier;
    }

    const getIncome = (dataPoints, periodDays = 1) => {
        return dataPoints.filter(dataPoint => dataPoint.is_expense === false)
            .filter(dataPoint => dataPoint.time > (Date.now() - periodDays * 24 * 60 * 60 * 1000) / 1000)
            .reduce((total, current) => total + current.send_amount, 0)
    }

    const getExpenses = (dataPoints, periodDays = 1) => {
        return dataPoints.filter(dataPoint => dataPoint.is_expense === true)
            .filter(dataPoint => dataPoint.time > (Date.now() - periodDays * 24 * 60 * 60 * 1000) / 1000)
            .reduce((total, current) => total + current.send_amount, 0)
    }

    const getBarGraphValue = (income, expense) => {
        if (income + expense == 0)
            return 0
        return income / (income + expense)
    }



    const goToShopViews = () => {
        navigation.navigate('ShopScreen');
    }

    const goToInitiativesViews = () => {
        navigation.navigate('ImpactInitiativesScreen');
    }

    const goToMyImpactViews = () => {
        navigation.navigate('MyImpactDash');
    }

    const goToTransactionHistory = () => {
        navigation.navigate('TransactionHistory');
    }

    const removeImpact = (item) => {

        const impacts = impactData;
        if (impacts && impacts.length > 0) {
            const filter = impacts.filter((news) => news.id !== item.id)
            setImpactData(filter)
        }

    }

    const account = { address: selectedAddress, ...identities[selectedAddress], ...accounts[selectedAddress] };

    return (
        <View style={styles.container}>
            {
                availableBalance === undefined ?
                    <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
                        <View style={[styles.errorWalletContainer, { backgroundColor: colors.transparent }]}>
                            <Text style={styles.errorWalletText}>
                                No Internet Connection Check your network settings and pull down to reconnect to your wallet.
                            </Text>
                        </View>
                    </ScrollView>
                    :
                    <>
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ flex: 1, paddingBottom: 20 }}>
                                <BITGAccountOverview account={account} />
                                <View style={styles.balanceContainer}>
                                    <Image style={styles.bitgImage} source={bitgImageSource} />
                                    <View>
                                        <Text style={styles.balanceText}>{strings('bitg_wallet.available_balance')}</Text>
                                        <View style={styles.bitgContainer}>
                                            <Image
                                                style={styles.bitgSmallImage}
                                                source={bitgImageSource}
                                                tintColor={Platform === 'ios' ? undefined : colors.blackColor}
                                            />
                                            <Text style={styles.bitgText}>{availableBalance?.balance}</Text>
                                            <TouchableRipple style={styles.bitgButton}>
                                                <Text style={{ fontSize: 18, marginBottom: 5 }}>{strings('bitg_wallet.bitg_symbol')}</Text>
                                            </TouchableRipple>
                                        </View>
                                        <View style={styles.usdContainer}>
                                            {/* <Feather style={styles.usdSmallImage} name="dollar-sign" size={18} color={colors.grey} /> */}
                                            <Text style={styles.usdText}>{availableBalance?.balanceFiat}</Text>
                                            <View style={styles.usdButton}>
                                                <Text style={{ fontSize: 18, marginBottom: 6 }}>{strings('bitg_wallet.usd_symbol')}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {
                                    tokenAsset && (
                                        <AssetElement
                                            key={'0x'}
                                            testID={'asset'}
                                            // onPress={this.onItemPress}
                                            // onLongPress={asset.isETH ? null : this.showRemoveMenu}
                                            asset={tokenAsset}
                                        >
                                            <TokenImage asset={tokenAsset} containerStyle={styles.ethLogo} />

                                            <View style={styles.balances} testID={'balance'}>
                                                <Text style={styles.balance}>{`${tokenBalance} wUSDT`}</Text>
                                                {tokenAsset.secondaryBalance ? (
                                                    <Text style={[styles.balanceFiat, asset?.balanceError && styles.balanceFiatTokenError]}>
                                                        {secondaryBalance}
                                                    </Text>
                                                ) : null}
                                            </View>
                                        </AssetElement>
                                    )
                                }

                                {
                                    impactData && impactData.length > 0 && (
                                        <View style={styles.impactWrapper}>
                                            {
                                                impactData.map((item, index) => (
                                                    <View key={index} style={styles.impactItem}>
                                                        <View style={styles.impactItemStarWrapper}>
                                                            <Image source={impactImageSource} style={styles.impactItemStar} />
                                                        </View>

                                                        <TouchableOpacity style={styles.impactItemTitle}>
                                                            <Text style={styles.impactText1}>
                                                                {`${item.title}  ${item.time}`}
                                                            </Text>
                                                            <Text style={styles.impactText2} numberOfLines={2} ellipsizeMode='tail'>
                                                                {item.content}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.impactItemClose} onPress={() => removeImpact(item)}>
                                                            <MaterialIcons name="close" size={14} color={colors.grey300} />
                                                        </TouchableOpacity>

                                                    </View>
                                                ))
                                            }
                                        </View>
                                    )
                                }

                                <View style={styles.transactionContainer}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <MaterialIcons style={{ transform: [{ rotate: "90deg" }] }} name="compare-arrows" size={24} color={colors.grey} />
                                        <Text style={styles.textDays}>{`Past ${periodDays} days`}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.transactionButton} onPress={goToTransactionHistory}>
                                        <Text style={styles.textTransaction}>{strings('bitg_wallet.view_transaction')} </Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    graphData && graphData.length > 0 && (
                                        <View style={[styles.graphView, { overflow: 'hidden', backgroundColor: "#ffffff" }]}>
                                            <LineChart
                                                style={{ marginLeft: -65 }}
                                                data={{
                                                    datasets: [
                                                        {
                                                            data: graphData
                                                        }
                                                    ]
                                                }}
                                                width={getGraphWidth(Dimensions.get("window").width + 25, graphData.length)}
                                                height={150}
                                                chartConfig={{
                                                    backgroundGradientFrom: "#ffffff",
                                                    backgroundGradientFromOpacity: 0,
                                                    backgroundGradientTo: "#ffffff",
                                                    backgroundGradientToOpacity: 0,
                                                    color: (opacity = 1) => `rgba(0, 165, 25, ${opacity})`,
                                                    strokeWidth: 0.1,
                                                    useShadowColorFromDataset: false,
                                                    fillShadowGradientOpacity: 0.4
                                                }}
                                                withDots={false}
                                                withInnerLine={false}
                                                withOuterLines={false}
                                                withVerticalLines={false}
                                                withHorizontalLines={false}
                                                withVerticalLabels={false}
                                                withHorizontalLabels={false}
                                                fromZero={true}
                                                bezier
                                            />
                                        </View>
                                    )
                                }

                                <ProgressBar style={styles.progressBar} progress={getBarGraphValue(income, expense) === 0.0 ? 0.5 : getBarGraphValue(income, expense)} color={colors.tintColor} />
                                <View style={styles.inExContainer}>
                                    <View>
                                        <Text style={styles.incomeText}> {strings('bitg_wallet.income')}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image
                                                style={{ height: 15, width: 15, resizeMode: "contain", ...Platform.select({ ios: { tintColor: colors.blackColor } }) }}
                                                source={bitgImageSource}
                                                tintColor={Platform === 'ios' ? undefined : colors.blackColor}
                                            />
                                            <Text style={styles.inExText}>{income.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={styles.expenseText}>{strings('bitg_wallet.expense')} </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image
                                                style={{ height: 15, width: 15, resizeMode: "contain", ...Platform.select({ ios: { tintColor: colors.blackColor } }) }}
                                                source={bitgImageSource}
                                                tintColor={Platform === 'ios' ? undefined : colors.blackColor}
                                            />
                                            <Text style={styles.inExText}>{expense.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                            <View style={styles.sendReceiveContainer}>
                                <TouchableOpacity style={styles.buttonWrapper} onPress={goToMyImpactViews}>
                                    <Image source={impactImageSource} style={styles.buttonImage} />
                                    <Text style={styles.buttonText}>{strings('bitg_wallet.my_impact')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonVibWrapper} onPress={goToInitiativesViews}>
                                    <Image source={initiativeImageSource} style={styles.buttonImage} />
                                    <Text style={styles.buttonText}>{strings('bitg_wallet.initiatives')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonShopWrapper} onPress={goToShopViews}>
                                    <Image source={shopImageSource} style={styles.buttonImage} />
                                    <Text style={styles.buttonText}>{strings('bitg_wallet.shop')}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </>
            }
        </View >
    );
}

MyWalletScreen.navigationOptions = ({ navigation }) => getBITGWalletNavbarOptions('bitg_wallet.my_wallet', navigation);

MyWalletScreen.propTypes = {
    swapsTokens: PropTypes.arrayOf(PropTypes.object),
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
    tokenExchangeRates: PropTypes.object,

    /**
     * Function to set hasOnboarded
     */
    setHasOnboarded: PropTypes.func,
    /**
     * Function to set liveness
     */
    setLiveness: PropTypes.func,
    /**
 * An object containing each identity in the format address => account
 */
    identities: PropTypes.object,

    api: PropTypes.object,
};

const mapStateToProps = state => ({
    swapsTokens: state.engine.backgroundState.SwapsController.tokens,
    accounts: state.engine.backgroundState.AccountTrackerController.accounts,
    selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
    balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
    conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
    tokenExchangeRates: state.engine.backgroundState.TokenRatesController.contractExchangeRates,
    currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency,
    identities: state.engine.backgroundState.PreferencesController.identities,
    api: state.polka.api
});

const mapDispatchToProps = dispatch => ({
    setHasOnboarded: hasOnboarded => dispatch(setSwapsHasOnboarded(hasOnboarded)),
    setLiveness: liveness => dispatch(setSwapsLiveness(liveness))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyWalletScreen);
