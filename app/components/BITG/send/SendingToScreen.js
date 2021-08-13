import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, Platform, TextInput,ActivityIndicator, TouchableOpacity,Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TouchableRipple } from 'react-native-paper';
// import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';


import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Device from '../../../util/Device';
import { renderShortAddress } from '../../../util/address';

import { getEmptyHeaderOptions, getBITGWalletNavbarOptions } from '../../UI/Navbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Modal from 'react-native-modal';
import { doENSLookup, doENSReverseLookup } from '../../../util/ENSUtils';

import AddressList from '../../Views/SendFlow/AddressList';
import AccountList from '../../UI/AccountList';

import { isValidAddress, toChecksumAddress } from 'ethereumjs-util';
import SendAddressModal from './SendAddressModal'

import Engine from '../../../core/Engine';

import { protectWalletModalVisible } from '../../../actions/user';
import { toggleAccountsModal, toggleReceiveModal } from '../../../actions/modals';

import { isValidAddressPolkadotAddress } from '../../../util/address'
import {
  renderFromTokenMinimalUnit,
  balanceToFiat,
  renderFromWei,
  weiToFiat,
  fromWei,
  toWei,
  isDecimal,
  toTokenMinimalUnit,
  fiatNumberToWei,
  fiatNumberToTokenMinimalUnit,
  weiToFiatNumber,
  balanceToFiatNumber,
  getCurrencySymbol,
  handleWeiNumber,
  fromTokenMinimalUnitString,
  toHexadecimal
} from '../../../util/number';
import { isENS } from '../../../util/address';

import NetworkList from '../../../util/networks';

// import QRCodeScreen from '../QRCodeScreen';

const dummy = () => true;

const walletImageSource = require('../../../images/ic_wallet.png');
const address_book_source = require('../../../images/ic_address_book.png');
const barcode_source = require('../../../images/ic_barcode.png');

const bit_currency = require('../../../images/ic_bitg.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    color: colors.tintColor,
    marginTop: 20,
  },
  myWalletContainer: {
    height: 60,
    marginStart: 20,
    marginEnd: 20,
    borderWidth: 1,
    borderColor: colors.tintColor,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  myPrimaryContainer: {
    flex: 1,
    marginStart: 20,
  },
  walletImage: {
    width: 33,
    height: 30,
    marginStart: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.tintColor,
    textTransform: 'uppercase'
  },
  sendingToContainer: {
    height: 80,
    marginTop: 20,
    marginStart: 20,
    marginEnd: 20,
  },
  amountContainer: {
    marginTop: 20,
    marginStart: 20,
    marginEnd: 20,
  },
  sendingInput: {
    flex: 1,
    backgroundColor: colors.light_gray,
    padding: 10,
    marginTop: 5,
    marginEnd: 5,
    marginBottom: 5,
    fontSize: 18,

  },
  amountInput: {
    padding: 10,
    marginEnd: 5,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  amountWrapper: {
    marginTop: 5,
    backgroundColor: colors.light_gray,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  currencyIcon: {
    tintColor: colors.grey500,
    width: 30,
    height: 30,
  },
  switch: {
    flex: 1,
    marginTop: Device.isIos() ? 4 : 2,
    marginLeft: 10,
  },
  inputCurrencyText: {
    ...fontStyles.normal,
    fontWeight: fontStyles.light.fontWeight,
    color: colors.grey500,
    fontSize: 30,
    marginLeft: 10,
    paddingVertical: Device.isIos() ? 0 : 8,
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'uppercase'
  },
});

class SendingToScreen extends PureComponent {

  static propTypes = {
    /**
     * Navigation object required to push
     * the Asset detail view
     */
    navigation: PropTypes.object,
    /**
     * ETH to current currency conversion rate
     */
    conversionRate: PropTypes.number,
    /**
     * Currency code of the currently-active currency
     */
    currentCurrency: PropTypes.string,
    /**
     * Object containing token balances in the format address => balance
     */
    tokenBalances: PropTypes.object,
    /**
     * Object containing token exchange rates in the format address => exchangeRate
     */
    tokenExchangeRates: PropTypes.object,
    /**
     * Array of transactions
     */
    transactions: PropTypes.array,
    /**
     * Primary currency, either ETH or Fiat
     */
    primaryCurrency: PropTypes.string,

    currentPage: PropTypes.number,

    getSendingData: PropTypes.func,

    clearChildrenState: PropTypes.bool,

    loaderIndicator: PropTypes.bool,
  };

  state = {
    loading: false,
    error: null,
    amount: undefined,
    fiat: undefined,
    amountInput: undefined,
    address: null,
    name: null,
    showModalAddress: false,
    showModalAccount: false,
    editable: true,
    addressInput: '',

    addressError: undefined,
    balanceIsZero: false,
    fromAccountModalVisible: false,
    fromAddressModalVisible: false,
    addToAddressBookModalVisible: false,
    fromSelectedAddress: this.props.selectedAddress,
    fromAccountName: this.props.identities[this.props.selectedAddress].name,
    fromAccountBalance: undefined,
    toSelectedAddress: undefined,
    toSelectedAddressName: undefined,
    toSelectedAddressReady: false,
    toEnsName: undefined,
    addToAddressToAddressBook: false,
    alias: undefined,
    confusableCollection: [],
    inputWidth: { width: '99%' }

  };
  
  animatingAccountsModal = false;

  addressToInputRef = React.createRef();

  componentDidMount() {
    const pass_activity = this.props.navigation.getParam('activity', null);
    console.log()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage !== this.props.currentPage) {
      this.setState({
        amount: undefined,
        fiat: undefined,
        address: null,
        amountInput: null
      })
    }
  }


  onToSelectedAddressChange = async toSelectedAddress => {

    console.log('onToSelectedAddressChange:', toSelectedAddress)

    const { AssetsContractController } = Engine.context;
    const { addressBook, network, identities, providerType } = this.props;
    const networkAddressBook = addressBook[network] || {};

    let addressError, toAddressName, toEnsName, errorContinue, isOnlyWarning;
    let [addToAddressToAddressBook, toSelectedAddressReady] = [false, false];

    if (isValidAddressPolkadotAddress(toSelectedAddress)) {
      this.setState({
        address: toSelectedAddress,
        showModalAddress: false,
      })

      this.props.getSendingData({
        address: toSelectedAddress,
      })

      const checksummedToSelectedAddress = toChecksumAddress(toSelectedAddress);
      toSelectedAddressReady = true;
      const ens = await doENSReverseLookup(toSelectedAddress);
      if (ens) {
        toAddressName = ens;
        if (!networkAddressBook[checksummedToSelectedAddress] && !identities[checksummedToSelectedAddress]) {
          addToAddressToAddressBook = true;
        }
      } else if (networkAddressBook[checksummedToSelectedAddress] || identities[checksummedToSelectedAddress]) {
        toAddressName =
          (networkAddressBook[checksummedToSelectedAddress] &&
            networkAddressBook[checksummedToSelectedAddress].name) ||
          (identities[checksummedToSelectedAddress] && identities[checksummedToSelectedAddress].name);
      } else {
        // If not in address book nor user accounts
        addToAddressToAddressBook = true;
      }

      // Check if it's token contract address on mainnet
      const networkId = NetworkList[providerType].networkId;
      if (networkId === 1) {
        try {
          const symbol = await AssetsContractController.getAssetSymbol(toSelectedAddress);
          if (symbol) {
            addressError = (
              <Text>
                <Text>{strings('transaction.tokenContractAddressWarning_1')}</Text>
                <Text style={styles.bold}>{strings('transaction.tokenContractAddressWarning_2')}</Text>
                <Text>{strings('transaction.tokenContractAddressWarning_3')}</Text>
              </Text>
            );
            errorContinue = true;
          }
        } catch (e) {
          // Not a token address
        }
      }

      /**
       * Not using this for now; Import isSmartContractAddress from utils/transaction and use this for checking smart contract: await isSmartContractAddress(toSelectedAddress);
       * Check if it's smart contract address
       */
      /*
      const smart = false; //

      if (smart) {
        addressError = strings('transaction.smartContractAddressWarning');
        isOnlyWarning = true;
      }
      */
    } else if (isENS(toSelectedAddress)) {
      toEnsName = toSelectedAddress;
      const resolvedAddress = await doENSLookup(toSelectedAddress, network);
      if (resolvedAddress) {
        const checksummedResolvedAddress = toChecksumAddress(resolvedAddress);
        toAddressName = toSelectedAddress;
        toSelectedAddress = resolvedAddress;
        toSelectedAddressReady = true;
        if (!networkAddressBook[checksummedResolvedAddress] && !identities[checksummedResolvedAddress]) {
          addToAddressToAddressBook = true;
        }
      } else {
        addressError = strings('transaction.could_not_resolve_ens');
      }
    } else if (toSelectedAddress && toSelectedAddress.length >= 42) {
      addressError = strings('transaction.invalid_address');
    }
    this.setState({
      addressError,
      toSelectedAddress,
      addToAddressToAddressBook,
      toSelectedAddressReady,
      toSelectedAddressName: toAddressName,
      toEnsName,
      errorContinue,
      isOnlyWarning
    });
  };

  toggleFromAccountModal = () => {
    const { fromAccountModalVisible } = this.state;
    this.setState({ fromAccountModalVisible: !fromAccountModalVisible });
  };

  toggleFromAddressBookModal = () => {
    const { showModalAddress } = this.state;
    this.setState({ showModalAddress: !showModalAddress });
  };

  renderFromAddressModal = () => {
    const { identities, keyrings, ticker } = this.props;
    const { showModalAddress, fromSelectedAddress, toSelectedAddress } = this.state;
    return (
      <Modal
        isVisible={showModalAddress}
        style={styles.bottomModal}
        onBackdropPress={this.toggleFromAddressBookModal}
        onBackButtonPress={this.toggleFromAddressBookModal}
        onSwipeComplete={this.toggleFromAddressBookModal}
        swipeDirection={'down'}
        propagateSwipe
      >
        <SendAddressModal
          inputSearch={toSelectedAddress}
          onAccountPress={this.onToSelectedAddressChange}
          onAccountLongPress={dummy}
        />
      </Modal>
    )
  }


  validateToAddress = async () => {
    const { toSelectedAddress } = this.state;
    const { network } = this.props;
    let addressError;
    // if (isENS(toSelectedAddress)) {
    // 	const resolvedAddress = await doENSLookup(toSelectedAddress, network);
    // 	if (!resolvedAddress) {
    // 		addressError = strings('transaction.could_not_resolve_ens');
    // 	}
    // } else if (!isValidAddress(toSelectedAddress)) {
    // 	addressError = strings('transaction.invalid_address');
    // }
    this.setState({ addressError });
    return addressError;
  };


  onScan = () => {
    this.props.navigation.navigate('QRScanner', {
      onScanSuccess: meta => {
        if (meta.target_address) {
          console.log('onScallSuccessL', meta.target_address)
          this.onToSelectedAddressChange(meta.target_address);
        }
      }
    });
  };

  openOrCloseQrCodeModal = visibility => {
    if (!visibility) {
      global.isRequestForPermission = false;
    }
    if (visibility) {
      this.onScan();
    }
  };

  openOrCloseAddressBookModal = visibility => {
    this.setState({
      showModalAddress: visibility,
      fromAddressModalVisible: visibility
    })
  }

  addressFieldChanged = text => {

    if (isValidAddressPolkadotAddress(text)) {
      this.setState({
        addressInput: text,
        address: text
      })

      this.props.getSendingData({
        address: text,
      })

    } else {
      this.setState({
        addressInput: text
      })
    }
  };

  amountBITGFieldChanged = inputValue => {
    const { conversionRate, currentCurrency } = this.props;

    let inputValueConversion, renderableInputValueConversion, hasExchangeRate, comma;
    // Remove spaces from input
    inputValue = inputValue && inputValue.replace(/\s+/g, '');
    // Handle semicolon for other languages
    if (inputValue && inputValue.includes(',')) {
      comma = true;
      inputValue = inputValue.replace(',', '.');
    }

    const processedInputValue = isDecimal(inputValue) ? handleWeiNumber(inputValue) : '0';

    hasExchangeRate = !!conversionRate;

    inputValueConversion = `${weiToFiatNumber(toWei(processedInputValue), conversionRate)}`;
    renderableInputValueConversion = `${weiToFiat(
      toWei(processedInputValue),
      conversionRate,
      currentCurrency
    )}`;



    if (comma) inputValue = inputValue && inputValue.replace('.', ',');
    inputValueConversion = inputValueConversion === '0' ? undefined : inputValueConversion;

    console.log('processedInputValue:', processedInputValue, inputValue)

    this.setState({
      amount: fromWei(toWei(processedInputValue)),
      amountInput: inputValue,
      fiat: inputValueConversion
    })

    this.props.getSendingData({
      fiat: inputValueConversion,
      amountInput: inputValue,
      amount: fromWei(toWei(processedInputValue)),
    })

  };

  amountFiatFieldChanged = inputValue => {
    const { conversionRate, currentCurrency } = this.props;

    let inputValueConversion, renderableInputValueConversion, hasExchangeRate, comma;
    // Remove spaces from input
    inputValue = inputValue && inputValue.replace(/\s+/g, '');
    // Handle semicolon for other languages
    if (inputValue && inputValue.includes(',')) {
      comma = true;
      inputValue = inputValue.replace(',', '.');
    }

    const processedInputValue = isDecimal(inputValue) ? handleWeiNumber(inputValue) : '0';

    hasExchangeRate = !!conversionRate;

    inputValueConversion = `${renderFromWei(fiatNumberToWei(processedInputValue, conversionRate))}`;

    renderableInputValueConversion = `${inputValueConversion} BITG`;

    if (comma) inputValue = inputValue && inputValue.replace('.', ',');
    inputValueConversion = inputValueConversion === '0' ? undefined : inputValueConversion;

    console.log('processedInputValue:2:', processedInputValue)

    this.setState({
      amount: inputValueConversion,
      fiat: fromWei(toWei(processedInputValue))
    })

    this.props.getSendingData({
      amount: inputValueConversion,
      fiat: fromWei(toWei(processedInputValue)),
    })
  };

  toggleAccountsModal = () => {
		const { onboardingWizard } = this.props;
		if (!onboardingWizard && !this.animatingAccountsModal) {
			this.animatingAccountsModal = true;
			this.props.toggleAccountsModal();
			setTimeout(() => {
				this.animatingAccountsModal = false;
			}, 500);
		}
	};


  render = () => {
    const { ticker } = this.props;
    const { addressBook, network } = this.props;
    const {
      fromSelectedAddress,
      fromAccountName,
      fromAccountBalance,
      toSelectedAddress,
      toSelectedAddressReady,
      toSelectedAddressName,
      addToAddressToAddressBook,
      addressError,
      balanceIsZero,
      toInputHighlighted,
      inputWidth,
      errorContinue,
      isOnlyWarning,
      confusableCollection,
      showModalAddress,
      amountInput
    } = this.state;


    const { selectedAddress, paramsData, currentCurrency, loaderIndicator, } = this.props;

    const { editable, address, name, amount, fiat } = this.state;

    const checksummedAddress = toSelectedAddress && toChecksumAddress(toSelectedAddress);
    const existingContact = checksummedAddress && addressBook[network] && addressBook[network][checksummedAddress];
    const displayConfusableWarning = !existingContact && confusableCollection && !!confusableCollection.length;
    const displayAsWarning =
      confusableCollection && confusableCollection.length && !confusableCollection.some(hasZeroWidthPoints);

    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>

        {
          loaderIndicator &&
          <View style={{
            position:'absolute',
            top:0,
            left:0,
            zIndex:50,
            backgroundColor: colors.transparent,
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 80,
          }} >
            <ActivityIndicator style={{ alignSelf: 'center', justifyContent: 'center' }} size="large" color={colors.tintColor} />
          </View>
        }
        <Text style={styles.title}>{strings('bitg_wallet.send_title')} </Text>
        <TouchableOpacity onPress={this.toggleAccountsModal} style={styles.myWalletContainer}>
          <Image
            style={[
              styles.walletImage,
              { ...Platform.select({ ios: { tintColor: colors.blackColor } }) },
            ]}
            source={walletImageSource}
            tintColor={Platform === 'ios' ? undefined : colors.blackColor}
          />
          <View style={styles.myPrimaryContainer}>
            <Text style={{ fontSize: 12, color: colors.grey }}>
              {strings('bitg_wallet.my_primary_address')}
            </Text>
            <Text
              style={{ fontSize: 14, color: colors.blackColor, marginEnd: 10 }}
              numberOfLines={2}>
              {renderShortAddress(selectedAddress)}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.sendingToContainer}>
          <Text style={styles.inputLabel}>
            {strings('bitg_wallet.sending_to')}
          </Text>
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <TextInput
              style={styles.sendingInput}
              placeholder={strings('bitg_wallet.send_address_hint')}
              placeholderTextColor={colors.grey500}
              editable={editable}
              onChangeText={this.addressFieldChanged}
              defaultValue={
                address === undefined
                  ? name === undefined
                    ? ''
                    : name
                  : address
              }
            />
            {paramsData != undefined ? null : (
              <TouchableOpacity
                style={styles.icon}
                onPress={() => this.openOrCloseAddressBookModal(true)}>
                <Image
                  style={[styles.icon, { resizeMode: 'center' }]}
                  source={address_book_source}
                />
              </TouchableOpacity>
            )}
            {paramsData != undefined ? null : (
              <TouchableOpacity
                style={styles.icon}
                onPress={() => this.openOrCloseQrCodeModal(true)}>
                <Image
                  style={[styles.icon, { resizeMode: 'contain' }]}
                  source={barcode_source}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.inputLabel}>
            {strings('bitg_wallet.amount')}
          </Text>

          <View style={styles.amountWrapper}>
            <Image
              style={[styles.currencyIcon, { resizeMode: 'center' }]}
              source={bit_currency}
            />

            <TextInput
              style={styles.amountInput}
              placeholder={`BITG ${strings('bitg_wallet.amount')}`}
              placeholderTextColor={colors.grey500}
              keyboardType="numeric"
              onChangeText={this.amountBITGFieldChanged}
              value={amountInput}
              defaultValue={
                amountInput === undefined ? '' : amountInput
              }
            />
          </View>

          <MaterialCommunityIcons
            name="swap-vertical"
            size={24}
            color={colors.grey500}
            style={styles.switch}
          />

          <View style={styles.amountWrapper}>
            {/* <MaterialCommunityIcons
            name={`currency-${currentCurrency}`}
            size={30}
            color={colors.grey500}
          /> */}
            <Text style={styles.inputCurrencyText}>{`${getCurrencySymbol(currentCurrency)} `}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder={`${String(currentCurrency).toUpperCase()} ${strings('bitg_wallet.amount')}`}
              placeholderTextColor={colors.grey500}
              keyboardType="numeric"
              onChangeText={this.amountFiatFieldChanged}
              value={fiat}
              defaultValue={
                fiat === undefined ? '' : fiat
              }
            />
          </View>



        </View>
        {/* <AddressBookModal
        visibility={modalVisibilityAddressBook}
        closeModal={() => openOrCloseAddressBookModal(false)}
        getDataFromAddressBook={getDataFromAddressBook}
        navigation={navigation}
      /> */}
        {/* {this.renderFromAccountModal()} */}
        {this.renderFromAddressModal()}

      </KeyboardAwareScrollView>
    )
  }
}


const mapStateToProps = state => ({
  accounts: state.engine.backgroundState.AccountTrackerController.accounts,
  addressBook: state.engine.backgroundState.AddressBookController.addressBook,
  selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
  selectedAsset: state.transaction.selectedAsset,
  identities: state.engine.backgroundState.PreferencesController.identities,
  keyrings: state.engine.backgroundState.KeyringController.keyrings,
  ticker: state.engine.backgroundState.NetworkController.provider.ticker,
  network: state.engine.backgroundState.NetworkController.network,
  providerType: state.engine.backgroundState.NetworkController.provider.type,
  balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
  conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
  currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency
});

const mapDispatchToProps = dispatch => ({
  setRecipient: (from, to, ensRecipient, transactionToName, transactionFromName) =>
    dispatch(setRecipient(from, to, ensRecipient, transactionToName, transactionFromName)),
  newAssetTransaction: selectedAsset => dispatch(newAssetTransaction(selectedAsset)),
  setSelectedAsset: selectedAsset => dispatch(setSelectedAsset(selectedAsset)),
  toggleAccountsModal: () => dispatch(toggleAccountsModal()),
	toggleReceiveModal: asset => dispatch(toggleReceiveModal(asset))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendingToScreen);

