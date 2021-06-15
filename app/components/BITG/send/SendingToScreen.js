import React, {useEffect,useState,useContext,useRef} from 'react';
import {View, Text, StyleSheet, Image, Platform, TextInput,  TouchableOpacity,} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableRipple} from 'react-native-paper';
// import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';


import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Device from '../../../util/Device';

import { getEmptyHeaderOptions, getBITGWalletNavbarOptions } from '../../UI/Navbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import QRCodeScreen from '../QRCodeScreen';

const walletImageSource = require('../../../images/ic_wallet.png');
const address_book_source = require('../../../images/ic_address_book.png');
const barcode_source = require('../../../images/ic_barcode.png');

const bit_logo = require('../../../images/ic_bitg.png');

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
  inputLabel:{
   fontSize: 14, 
   color: colors.tintColor,
   textTransform:'uppercase'
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
  },
  amountInput: {
    padding: 10,
    marginEnd: 5,
    marginBottom: 5,
    alignItems:'center',
    textAlignVertical:'center'
  },
  amountWrapper:{
    marginTop: 5,
    backgroundColor: colors.light_gray,
    borderRadius:5,
    flexDirection:'row',
    alignItems:'center'
  },
  icon: {
    width: 40,
    height: 40,
  },
  currencyIcon:{
    tintColor:colors.grey500,
    width: 30,
    height: 30,
  },
  switch: {
 		flex: 1,
    marginTop: Device.isIos() ? 4 : 2,
    marginLeft:10,
	},
});

function SendingToScreen({
  myWalletAddress,
  getSendingData,
  paramsData,
  currentPage,
  navigation,
  clerarChildrenState,
}) {

  const [sendingData, setSendingData] = useState({
    name: undefined,
    address: undefined,
    amount: undefined,
    usd:undefined
  });

  const [modalVisibilityQrCode, setVisibilityModalQrCode] = useState(
    false,
  );
  const [
    modalVisibilityAddressBook,
    setVisibilityModalAddressBook,
  ] = useState(false);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (paramsData != undefined) {
      setSendingData({
        name: paramsData.name,
        address: paramsData.address,
        amount: undefined,
      });
    }
    setEditable(true);
  }, []);

  useEffect(() => {
    if (sendingData) {
      getSendingData(sendingData);
    }
  }, [sendingData]);

  useEffect(() => {
    if (clerarChildrenState) {
      setSendingData({
        name: undefined,
        address: undefined,
        amount: undefined,
      });
    }
  }, [clerarChildrenState]);

  onToSelectedAddressChange = async toSelectedAddress => {
		const { AssetsContractController } = Engine.context;
		const { addressBook, network, identities, providerType } = this.props;
		const networkAddressBook = addressBook[network] || {};
		let addressError, toAddressName, toEnsName, errorContinue, isOnlyWarning;
		let [addToAddressToAddressBook, toSelectedAddressReady] = [false, false];
		if (isValidAddress(toSelectedAddress)) {
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
  

  const onScan = () => {
		navigation.navigate('QRScanner', {
			onScanSuccess: meta => {
				if (meta.target_address) {
					this.onToSelectedAddressChange(meta.target_address);
				}
			}
		});
	};

  const openOrCloseQrCodeModal = visibility => {
    if (!visibility) {
      global.isRequestForPermission = false;
      
    }
    onScan();
    // check(
    //   Platform.select({
    //     android: PERMISSIONS.ANDROID.CAMERA,
    //     ios: PERMISSIONS.IOS.CAMERA,
    //   }),
    // )
    //   .then(result => {
    //     if (result != RESULTS.GRANTED && visibility) {
    //       global.isRequestForPermission = true;
    //     }
    //   })
    //   .catch(error => {});
    setVisibilityModalQrCode(visibility);
  };

  const openOrCloseAddressBookModal = visibility => {
    setVisibilityModalAddressBook(visibility);
  };

  const searchFieldChanged = text => {
    setSendingData({...sendingData, name: text.trim(), address: undefined});
  };

  const amountBITGFieldChanged = text => {
    setSendingData({...sendingData, amount: text.trim()});
  };

  const amountUSDFieldChanged = text => {
    setSendingData({...sendingData, usd: text.trim()});
  };

  const getDataFromQRCode = async data => {
    var parseQrAddress = '';
    if (data.lastIndexOf('?') !== -1) {
      parseQrAddress = data.substring(
        data.lastIndexOf(':') + 1,
        data.lastIndexOf('?'),
      );
    } else {
      parseQrAddress = data.substring(data.lastIndexOf(':') + 1);
    }
    if (parseQrAddress.length > 0) {
      setSendingData({
        ...sendingData,
        name: 'No Name',
        address: parseQrAddress,
      });
    }
  };

  const getDataFromAddressBook = data => {
    setSendingData({
      ...sendingData,
      name: data.name,
      address: data.address,
    });
  };

  return (
    <KeyboardAwareScrollView style={{flex: 1}}>
      <Text style={styles.title}>{strings('bitg_wallet.send_title')} </Text>
      <View style={styles.myWalletContainer}>
        <Image
          style={[
            styles.walletImage,
            {...Platform.select({ios: {tintColor: colors.blackColor}})},
          ]}
          source={walletImageSource}
          tintColor={Platform === 'ios' ? undefined : colors.blackColor}
        />
        <View style={styles.myPrimaryContainer}>
          <Text style={{fontSize: 12, color: colors.grey}}>
            {strings('bitg_wallet.my_primary_address')}
          </Text>
          <Text
            style={{fontSize: 14, color: colors.blackColor, marginEnd: 10}}
            numberOfLines={2}>
            {myWalletAddress}
          </Text>
        </View>
      </View>
      <View style={styles.sendingToContainer}>
        <Text style={styles.inputLabel}>
          {strings('bitg_wallet.sending_to')}
        </Text>
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <TextInput
            style={styles.sendingInput}
            placeholder=  {strings('bitg_wallet.send_address_hint')}
            inpu
            placeholderTextColor={colors.grey500}
            editable={editable}
            onChangeText={searchFieldChanged}
            defaultValue={
              sendingData.address === undefined
                ? sendingData.name === undefined
                  ? ''
                  : sendingData.name
                : sendingData.address
            }
          />
          {paramsData != undefined ? null : (
            <TouchableOpacity
              style={styles.icon}
              onPress={() => openOrCloseAddressBookModal(true)}>
              <Image
                style={[styles.icon, {resizeMode: 'center'}]}
                source={address_book_source}
              />
            </TouchableOpacity>
          )}
          {paramsData != undefined ? null : (
            <TouchableOpacity
              style={styles.icon}
              onPress={() => openOrCloseQrCodeModal(true)}>
              <Image
                style={[styles.icon, {resizeMode: 'center'}]}
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
                style={[styles.currencyIcon, {resizeMode: 'center'}]}
                source={bit_logo}
          />

          <TextInput
            
            style={styles.amountInput}
            placeholder={`BITG ${strings('bitg_wallet.amount')}`}
            placeholderTextColor={colors.grey500}
            keyboardType="numeric"
            onChangeText={amountBITGFieldChanged}
            defaultValue={
              sendingData.amount === undefined ? '' : sendingData.amount
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
       
        <MaterialCommunityIcons
          name="currency-usd"
          size={30}
          color={colors.grey500}
        />
          <TextInput
            style={styles.amountInput}
            placeholder={`USD ${strings('bitg_wallet.amount')}`}
            placeholderTextColor={colors.grey500}
            keyboardType="numeric"
            onChangeText={amountUSDFieldChanged}
            defaultValue={
              sendingData.usd === undefined ? '' : sendingData.usd
            }
          />
        </View>



      </View>
      {/* <QRCodeScreen
        visibility={modalVisibilityQrCode}
        closeModal={() => openOrCloseQrCodeModal(false)}
        getDataFromQRCode={getDataFromQRCode}
      /> */}
      {/* <AddressBookModal
        visibility={modalVisibilityAddressBook}
        closeModal={() => openOrCloseAddressBookModal(false)}
        getDataFromAddressBook={getDataFromAddressBook}
        navigation={navigation}
      /> */}
    </KeyboardAwareScrollView>
  );
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
	providerType: state.engine.backgroundState.NetworkController.provider.type
});

const mapDispatchToProps = dispatch => ({
	setRecipient: (from, to, ensRecipient, transactionToName, transactionFromName) =>
		dispatch(setRecipient(from, to, ensRecipient, transactionToName, transactionFromName)),
	newAssetTransaction: selectedAsset => dispatch(newAssetTransaction(selectedAsset)),
	setSelectedAsset: selectedAsset => dispatch(setSelectedAsset(selectedAsset))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SendingToScreen);

