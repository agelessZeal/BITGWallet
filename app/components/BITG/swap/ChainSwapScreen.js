import React, {useEffect,useState,useContext,useRef} from 'react';
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
import {TouchableRipple} from 'react-native-paper';
import ViewPager from '@react-native-community/viewpager';
import NetInfo from '@react-native-community/netinfo';

import { showAlert } from '../../../actions/alert';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';


import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEmptyHeaderOptions, getBITGWalletNavbarOptions } from '../../UI/Navbar';

import ChainSwapStart from './ChainSwapStart';
import ChainSwapProgress from './ChainSwapProgress';
import ChainSwapSucess from './ChainSwapSucess';
import Device from '../../../util/Device';
import {makeAlert,sleep} from '../lib/Helpers'
import {createApolloClient} from '../api/createApolloClient';

import { renderFromWei, weiToFiat, hexToBN, weiToFiatNumber, fiatNumberToWei } from '../../../util/number';

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
    textTransform:'uppercase'
  },
  nextText: {
    fontSize: 16,
    color: colors.tintColor,
    fontWeight: 'bold',
    textTransform:'uppercase'
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


function ChainSwapScreen(props) {

  const navigation = useContext(NavigationContext);

  const client = createApolloClient();
  // const {state, setTransaction} = useContext(TransactionContext);
  // const walletContext = useContext(WalletContext);

  const [navigationType, setNavigationType] = useState('');

  const [sendingData, setSendingData] = useState({
    name: undefined,
    address: undefined,
    amount: undefined,
    transactionHash: undefined,
  });

  const [clerarChildrenState, setClearChildrenState] = useState(false);
  const [refreshWallet, setRefreshWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myPrimaryAddress, setPrimaryAddress] = useState(props.selectedAddress);
  const [myBalance, setMyBalance] = useState(0);
  const [page, setPage] = useState(0);
  const viewPager = useRef();

  useEffect(()=>{
    let addressData = navigation.getParam('data',null)
    console.log('ChainSwapScreen:',addressData)
  },[])

  useEffect(() => {
    try {
      const {accounts,selectedAddress} = props;
      if (accounts && accounts[selectedAddress] && accounts[selectedAddress].balance) {
        const balance = renderFromWei(accounts[selectedAddress].balance);
        setMyBalance(parseFloat(balance))
      }
    } catch (e) {
      console.log('swap calc balance error:', e)
    }
  },[props.accounts, props.selectedAddress])


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // setNavigationType(route.params.navigationType);
    });
  }, [navigation]);

  const getWalletInfo = async () => {

  };

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
    setPage(e.nativeEvent.position);
  };

  const move = delta => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        makeAlert('Please connect to the internet');

      } else {
          var nextPage = page + delta;
          viewPager.current.setPage(nextPage);
      }
    });
  };


  const setLoaderIndicator = show => {
    setLoading(show);
  };

  const updateTransactionsState = transactions => {
    // setTransaction(transactions);
  };

  const next = () => {
    move(1)
  }

  const goHome = () => {
    setLoading(false);
    viewPager.current.setPageWithoutAnimation(0);
    navigation.navigate('WalletView')
  }

  return (
    <View style={styles.container}>
      {myPrimaryAddress === undefined && myBalance === undefined ? (
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              style={{flex: 1}}
              refreshing={refreshWallet}
              onRefresh={onRefresh}
            />
          }>
          <View
            style={[
              styles.errorWalletContainer,
              {backgroundColor: colors.transparent},
            ]}>
            <Text style={styles.errorWalletText}>
              No Internet Connection Check your network settings and pull down
              to reconnect to your wallet.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <>
          <ViewPager
            ref={viewPager}
            style={styles.viewPager}
            initialPage={0}
            scrollEnabled={false}
            onPageSelected={onPageSelected}>
            <ChainSwapStart
              key="1"
              currentPage={page}
              myWalletAddress={myPrimaryAddress}
              navigation={navigation}
              clerarChildrenState={clerarChildrenState}
              next={next}
            />
            <ChainSwapProgress
              key="2"
              currentPage={page}
              myCurrentWalletBalance={myBalance}
              apolloClient={client}
              setLoaderIndicator={setLoaderIndicator}
              loaderIndicator={loading}
              next={next}
            />
            <ChainSwapSucess
              key="3"
              balance={myBalance}
              currentPage={page}
              navigation={navigation}
              updateGlobalState={updateTransactionsState}
              next={next}
              goHome ={goHome}
            />
          </ViewPager>

          {loading == true ? null : (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'position' : null}>
              <View style={styles.footerView}>
                {page == 0 || page > 1 ? (
                  <View style={styles.previousButton} />
                ) : (
                  <TouchableRipple
                    style={styles.previousButton}
                    onPress={() => move(-1)}>
                    <Text style={styles.previousText}>{strings('bitg_wallet.previous')}</Text>
                  </TouchableRipple>
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
                <View style={styles.nextButton} />
              </View>
            </KeyboardAvoidingView>
          )}
        </>
      )}
    </View>
  );
}

ChainSwapScreen.navigationOptions = ({ navigation }) => getBITGWalletNavbarOptions('bitg_wallet.chain_swap.title',navigation);

ChainSwapScreen.propTypes = {
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

const mapDispatchToProps = dispatch => ({
	showAlert: config => dispatch(showAlert(config)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps)
(ChainSwapScreen);

