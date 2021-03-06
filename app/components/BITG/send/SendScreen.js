import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import ViewPager from '@react-native-community/viewpager';
import NetInfo from '@react-native-community/netinfo';


import { showAlert } from '../../../actions/alert';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';


import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEmptyHeaderOptions, getBITGWalletNavbarOptions } from '../../UI/Navbar';
import { renderFromWei, weiToFiat, hexToBN, weiToFiatNumber, fiatNumberToWei, getCurrencySymbol } from '../../../util/number';
import SendingToScreen from './SendingToScreen';
import SendingProgressScreen from './SendingProgressScreen';
import PaymentSendScreen from './PaymentSendScreen';
import Device from '../../../util/Device';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { makeAlert, sleep } from '../lib/Helpers'
// import WalletManager from '../../wallet';
import { createApolloClient } from '../api/createApolloClient';

import Engine from '../../../core/Engine';
import { BN_ONE, BN_TEN, formatBalance, isBn, isUndefined, BN_ZERO, BN_TWO } from '@polkadot/util'


// Import the keyring as required
import { Keyring } from '@polkadot/api';

// import {showAlert, SATOSHI_CONST, sleep} from '../../lib/Helpers';
// import {Context as TransactionContext} from '../../lib/context/TransactionsContext';
// import {Context as WalletContext} from '../../lib/context/WalletContext';
import BN from "bn.js";

const img_send_source = require('../../../images/img_send.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imgBG: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    position: 'absolute',
    bottom: 0,
    marginStart: -30,
  },
  viewPager: {
    flex: 1,
    backgroundColor: colors.white,
  },
  footerView: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previousButton: {
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  nextButton: {
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  previousText: {
    fontSize: 16,
    color: colors.blackColor,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  nextText: {
    fontSize: 16,
    color: colors.tintColor,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  pageIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
    backgroundColor: colors.grey,
  },
  errorWalletContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorWalletText: {
    fontSize: 18,
    color: colors.redColor,
    textAlign: 'center',
  },
});


function SendScreen({
  swapsTokens,
  accounts,
  selectedAddress,
  balances,
  conversionRate,
  tokenExchangeRates,
  currentCurrency,
  showAlert,
  api
}) {

  const navigation = useContext(NavigationContext);

  const client = createApolloClient();
  // const {state, setTransaction} = useContext(TransactionContext);
  // const walletContext = useContext(WalletContext);

  const [navigationType, setNavigationType] = useState('');

  const [sendingData, setSendingData] = useState({
    name: undefined,
    address: undefined,
    amount: undefined,
    amountInput: undefined,
    fiatInput: undefined,
    transactionHash: undefined,
  });

  const [paymentInfo, setPaymentInfo] = useState(null)

  const [availableBalance, setAvailableBalance] = useState({
    balance: 0,
    balanceFiat: 0
  });

  useEffect(() => {
    try {
      if (accounts && accounts[selectedAddress] && accounts[selectedAddress].balance) {
        const balance = renderFromWei(accounts[selectedAddress].balance);
        let balanceFiat = weiToFiat(hexToBN(accounts[selectedAddress].balance), conversionRate, currentCurrency);
        if (balance === '0') {
          balanceFiat = getCurrencySymbol(currentCurrency) + ' 0'
        }
        setAvailableBalance({
          balance,
          balanceFiat
        })
        setMyBalance(parseFloat(balance))
      }
    } catch (e) {
      console.log('calc balance error:', e)
    }
  }, [accounts, selectedAddress])

  const [clearChildrenState, setClearChildrenState] = useState(false);
  const [refreshWallet, setRefreshWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myPrimaryAddress, setPrimaryAddress] = useState(selectedAddress);
  const [myBalance, setMyBalance] = useState(300);
  const [page, setPage] = useState(0);
  const viewPager = useRef();

  const [paymentTransfer, setPaymentTransfer] = useState(null)


  useEffect(() => {
    let addressData = navigation.getParam('data', null)
    // console.log('send sceen: yy', addressData)
  }, [])


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // setNavigationType(route.params.navigationType);
    });
  }, [navigation]);


  const onRefresh = async () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        (async () => {
          setRefreshWallet(true);
          try {
            // await WalletManager.connect();
            // walletContext.setWalletConnection(true);
          } catch (error) {
            console.log(error);
          }
          setRefreshWallet(false);
        })();
      }
    });
  };

  const onMenuPress = () => {
    switch (navigationType) {
      case 'MainStack':
        navigation.pop();
        break;
      default:
        navigation.toggleDrawer();
    }
  };

  const onPageSelected = e => {
    setPage(e.nativeEvent.position + 1);
  };
  const inputToBn = (input) => {

    if (!input) {
      return null;
    }
    const siPower = new BN(18);
    const basePower = 18;
    const siUnitPower = 0;

    const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);

    let result;

    if (isDecimalValue) {
      if (siUnitPower - isDecimalValue[2].length < -basePower) {
        result = new BN(-1);
      }

      const div = new BN(input.replace(/\.\d*$/, ''));
      const modString = input.replace(/^\d+\./, '').substr(0, api.registry.chainDecimals[0]);
      const mod = new BN(modString);

      result = div
        .mul(BN_TEN.pow(siPower))
        .add(mod.mul(BN_TEN.pow(new BN(basePower + siUnitPower - modString.length))));
    } else {
      result = new BN(input.replace(/[^\d]/g, ''))
        .mul(BN_TEN.pow(siPower));
    }
    return result;

  }
  const goPrevious = () => {
    var nextPage = page - 2;
    if(nextPage <= 0){
      setPage(0)
    }else{
      viewPager.current.setPage(nextPage);
    }
    
  }

  const move = delta => {

    NetInfo.fetch().then(async state => {
      if (!state.isConnected) {
        makeAlert('Please connect to the internet');
      } else {
        // console.log('move',showAlert)
        var nextPage = page + delta;

        console.log('sending data:', sendingData)

        if (
          sendingData.address === undefined ||
          sendingData.address === null ||
          sendingData.address === ''
        ) {
          makeAlert('Please write Recipient');

        } else if (sendingData.address === myPrimaryAddress) {

          makeAlert("App doesn't support sending coins to your address");

        } else {
          if (
            sendingData.amount === undefined ||
            sendingData.amount === null ||
            sendingData.amount == 0
          ) {
            makeAlert('Please write Amount');
          } else {
            if (sendingData.amount > myBalance) {
              makeAlert(
                'You try to send more BITG than you have on your wallet',
              );
            } else {
              if (nextPage === 1) {

                let result = inputToBn(sendingData.amount);

                if (!result) {
                  return
                }

                setLoading(true);

                const transfer = api.tx.balances.transfer(sendingData.address, result);

                console.log('transfer:', transfer)

                setPaymentTransfer(transfer)

                try {
                  const info = await transfer.paymentInfo(selectedAddress)
                  // log relevant info, partialFee is Balance, estimated for current
                  // console.log(`
                  // class=${info.class.toString()},
                  // weight=${info.weight.toString()},
                  // partialFee=${info.partialFee.toHuman()}
                  // `);

                  // console.log(info.partialFee)
                  setPaymentInfo(info)
                  setLoading(false);

                  // viewPager.current.setPage(2);
                  setPage(nextPage)
                  sleep(50).then(() => {
                    setPage(nextPage)
                    // viewPager.current.setPage(nextPage);
                  });

                } catch (error) {
                  console.log('payment infro error:', error)
                  setLoading(false);
                }


              }
              if (nextPage === 2) {
                if (sendingData.address != undefined) {
                  setLoading(true);

                  try {

                    const { KeyringController } = Engine.context;

                    const pairs = await KeyringController.getPolkaPair(selectedAddress);

                    // console.log('current polka pair:',pairs,selectedAddress)

                    if (!pairs || (pairs && pairs.length === 0)) {
                      console.log('Not found the correct polka pair')
                      return;
                    }
                    const pair = pairs[0]

                    console.log('Transfer:,', paymentTransfer)

                    // let { data: { free }, nonce } = await api.query.system.account(pair.address);

                    // console.log(`${pair.address} has a balance of ${free}, nonce ${nonce}`);
                    // console.log('amount:',sendingData.amount,parseFloat(sendingData.amount))


                    // // Sign and send the transaction using our account
                    const hash = await paymentTransfer.signAndSend(pair);

                    console.log('Transfer sent with hash', hash.toHex(), hash);

                    setSendingData({
                      ...sendingData,
                      transactionHash: hash.toHex(),
                    });


                    setLoading(false);

                    sleep(50).then(() => {

                      const { AccountTrackerController } = Engine.context;
                      AccountTrackerController.refresh();

                      viewPager.current.setPage(1);
                      setPage(2)
                    });



                  } catch (error) {
                    console.log('error:', error)
                    setLoading(false);
                  }
                } else {
                  makeAlert(
                    'You need to enter a valid data to send transactions. Please go to Previous page and enter correct data',
                  );
                }
              } else {
                // viewPager.current.setPage(nextPage);
              }
            }
          }
        }
      }
    });
  };

  const newTransaction = async () => {
    setLoading(false);
    setClearChildrenState(true);
    setSendingData({
      name: undefined,
      address: undefined,
      amount: undefined,
      amountInput: undefined,
      fiatInput: undefined,
      transactionHash: undefined,
    });
    // viewPager.current.setPageWithoutAnimation(0);
    setPage(0)
    await sleep(2000);
    setClearChildrenState(false);

    // if (route.params.data === undefined) {
    //   setClearChildrenState(true);
    //   setSendingData({
    //     name: undefined,
    //     address: undefined,
    //     amount: undefined,
    //     transactionHash: undefined,
    //   });
    //   viewPager.current.setPageWithoutAnimation(0);
    //   await sleep(2000);
    //   setClearChildrenState(false);
    // } else {
    //   viewPager.current.setPageWithoutAnimation(0);
    // }
  };

  const openTransactionHistory = () => {
    // navigation.navigate(Routes.TRANSACTION_HISTORY_SCREEN.TAG);
  };


  const getSendingData = data => {
    console.log('getSendingData:', data)
    setSendingData({
      address: data.address || sendingData.address,
      amount: data.amount || sendingData.amount,
      amountInput: data.amountInput || sendingData.amountInput,
      fiat: data.fiat || sendingData.fiat,
    });
  };


  const getDataFromApi = data => {
    if (data != undefined) {
      const hasName =
        data.name != null && data.name != undefined && data.name != '';
      setSendingData({
        ...sendingData,
        address: data.address,
        name: hasName ? data.name : data.address,
      });
    }
  };

  const setLoaderIndicator = show => {
    setLoading(show);
  };

  const updateTransactionsState = transactions => {
    // setTransaction(transactions);
  };

  const goNext = () => {
    move(1)
  }

  console.log('next page:',page)

  return (
    <View style={styles.container}>
      {page == 0 ? (
        <Image
          style={styles.imgBG}
          source={img_send_source}
        />
      ) : null}
      {myPrimaryAddress === undefined && myBalance === undefined ? (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              style={{ flex: 1 }}
              refreshing={refreshWallet}
              onRefresh={onRefresh}
            />
          }>
          <View
            style={[
              styles.errorWalletContainer,
              { backgroundColor: colors.transparent },
            ]}>
            <Text style={styles.errorWalletText}>
              No Internet Connection Check your network settings and pull down
              to reconnect to your wallet.
            </Text>
          </View>
        </ScrollView>
      ) : (

        <>
            {
              page === 0 ? (
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
                  <SendingToScreen
                    key="1"
                    currentPage={page}
                    getSendingData={getSendingData}
                    navigation={navigation}
                    clearChildrenState={clearChildrenState}
                    loaderIndicator={loading}
                    goNext={goNext}
                  />
                </KeyboardAwareScrollView>
              )
                : (
                  <ViewPager
                    ref={viewPager}
                    style={styles.viewPager}
                    initialPage={0}
                    scrollEnabled={false}
                    onPageSelected={onPageSelected}>
                    {/* <SendingToScreen
                      key="1"
                      currentPage={page}
                      getSendingData={getSendingData}
                      navigation={navigation}
                      clearChildrenState={clearChildrenState}
                      loaderIndicator={loading}
                      goNext={goNext}
                    /> */}
                    <SendingProgressScreen
                      key="1"
                      currentPage={page}
                      myCurrentWalletBalance={myBalance}
                      sendingData={sendingData}
                      paymentInfo={paymentInfo}
                      apolloClient={client}
                      getDataFromApi={getDataFromApi}
                      setLoaderIndicator={setLoaderIndicator}
                      loaderIndicator={loading}
                    />
                    <PaymentSendScreen
                      key="2"
                      newTransaction={newTransaction}
                      currentPage={page}
                      sendingData={sendingData}
                      viewTransactionHistory={openTransactionHistory}
                      showAlert={showAlert}
                      navigation={navigation}
                      // globalState={state}
                      updateGlobalState={updateTransactionsState}
                    />
                  </ViewPager>
                )}




            {loading == true ? null : (
              <View
                behavior={Platform.OS === 'ios' ? 'position' : null}>
                <KeyboardAvoidingView style={styles.footerView}>
                  {page == 0 || page > 1 ? (
                    <View style={styles.previousButton} />
                  ) : (
                      <TouchableOpacity
                        style={styles.previousButton}
                        onPress={goPrevious}>
                        <Text style={styles.previousText}>{strings('bitg_wallet.previous')}</Text>
                      </TouchableOpacity>
                    )}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={[
                        styles.pageIndicator,
                        {
                          backgroundColor:
                            page == 0 ? colors.tintColor : colors.grey200,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.pageIndicator,
                        {
                          backgroundColor:
                            page == 1 ? colors.tintColor : colors.grey200,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.pageIndicator,
                        {
                          backgroundColor:
                            page == 2 ? colors.tintColor : colors.grey200,
                        },
                      ]}
                    />
                  </View>
                  {page > 1 ? (
                    <View style={styles.nextButton} />
                  ) : (
                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => move(1)}>
                        <Text style={styles.nextText}>{` ${page == 1
                          ? strings('bitg_wallet.confirm')
                          : strings('bitg_wallet.next')
                          }  `}</Text>
                      </TouchableOpacity>
                    )}
                </KeyboardAvoidingView>
              </View>
            )}
          </>
        )}

    </View>
  );
}

SendScreen.navigationOptions = ({ navigation }) => getBITGWalletNavbarOptions('send.title', navigation);

SendScreen.propTypes = {
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
/* Triggers global alert
*/
  showAlert: PropTypes.func,


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
  api: state.polka.api
});

const mapDispatchToProps = dispatch => ({
  showAlert: config => dispatch(showAlert(config)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps)
  (SendScreen);

