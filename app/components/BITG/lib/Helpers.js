import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import Moment from 'moment';
import url from 'url'
const createHash = require('create-hash');

export const SATOSHI_CONST = 100000000;

export const ASYNC_STORAGE_USER_AUTH_TOKEN = '@APP_USER_AUTH_TOKEN';
export const ASYNC_STORAGE_USER_EXPIRE_DATE_TOKEN = '@APP_USER_EXPIRE_DATE_TOKEN';
export const ASYNC_STORAGE_USER_WALLET = '@APP_USER_WALLET';
export const ASYNC_STORAGE_USER_DATA = '@APP_USER';
export const ASYNC_STORAGE_USER_DATA_TRANSACTIONS = '@APP_USER_DATA_TRANSACTIONS';
export const ASYNC_STORAGE_APP_BIOMETRICS_ENABLED = '@APP_BIOMETRICS_ENABLED';
export const ASYNC_STORAGE_APP_UNLOCK_PASSWORD = '@APP_UNLOCK_PASSWORD';

export const getToken = async () => {
  return await AsyncStorage.getItem(ASYNC_STORAGE_USER_AUTH_TOKEN);
};

export const setToken = async (token) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_USER_AUTH_TOKEN, token)
};

export const getExpireDateToken = async () => {
  return await AsyncStorage.getItem(ASYNC_STORAGE_USER_EXPIRE_DATE_TOKEN);
};

export const setExpireDateToken = async (dateToken) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_USER_EXPIRE_DATE_TOKEN, dateToken)
};

export const getWallet = async () => {
  return await AsyncStorage.getItem(ASYNC_STORAGE_USER_WALLET);
};

export const setWallet = async (wallet) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_USER_WALLET, wallet)
};

export const getUserData = async () => {
  return await AsyncStorage.getItem(ASYNC_STORAGE_USER_DATA);
};

export const setUserData = async (data) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_USER_DATA, data)
};

export const getUserTransactions = async () => {
  return await AsyncStorage.getItem(ASYNC_STORAGE_USER_DATA_TRANSACTIONS);
};

export const setUserTransactions = async (data) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_USER_DATA_TRANSACTIONS, data)
}

export const getBiometricsEnabled = async () => {
  return await AsyncStorage.getItem(ASYNC_STORAGE_APP_BIOMETRICS_ENABLED)
    .then(value => value ? JSON.parse(value) : false)
};

export const setBiometricsEnabled = async (biometricsEnabled) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_APP_BIOMETRICS_ENABLED, JSON.stringify(biometricsEnabled))
}

export const getUnlockPassword = async () => {
  return await AsyncStorage.getItem(ASYNC_STORAGE_APP_UNLOCK_PASSWORD)
}

export const setUnlockPassword = async (password) => {
  await AsyncStorage.setItem(ASYNC_STORAGE_APP_UNLOCK_PASSWORD, password)
}

export const clearData = async () => {
  AsyncStorage.clear()
}

export const makeAlert = (message) => {
  Alert.alert(
    "BITG",
    message,
    [
      {
        text: "OK",
      }
    ]
  )
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const formatNumber = (value, digits = 0, commaDecimalPoint = false) => {
  const decimalDelimiter = commaDecimalPoint ? ',' : '.';
  const thousandsDelimiter = commaDecimalPoint ? '.' : ',';
  let valueString = value.toString()
  let intPart = valueString.split('.')[0];
  let decimalPart = valueString.split('.')[1] ? valueString.split('.')[1] : '';
  let intPartString = intPart.toString()
  let outputGroups = []
  let firstGroupLength = intPartString.length % 3
  if (firstGroupLength > 0) {
    outputGroups.push(intPartString.substr(0, firstGroupLength))
    intPartString = intPartString.substr(firstGroupLength)
  }
  while (intPartString.length > 0) {
    outputGroups.push(intPartString.substr(0, 3))
    intPartString = intPartString.substr(3)
  }
  let formattedIntPart = '';
  for (let i = 0; i < outputGroups.length; i++)
    formattedIntPart += outputGroups[i] + (i < outputGroups.length - 1 ? thousandsDelimiter : '');
  if (digits > 0) {
    let leadingZeros = 0;
    for (let i = 0; i < decimalPart.length; i++) {
      if (decimalPart.charAt(i) !== '0')
        break;
      else
        leadingZeros++
    }
    leadingZeros = leadingZeros >= digits ? leadingZeros + 1 : digits;
    let outputDecimalPart = decimalPart.substring(0, leadingZeros)
    while (outputDecimalPart.length < digits)
      outputDecimalPart += '0';
    return formattedIntPart + decimalDelimiter + outputDecimalPart;
  }
  else {
    return formattedIntPart;
  }
}

export const toFixedFloor = (value, decimals = 3) => {
  let multiplier = Math.pow(10, decimals);
  let outputString = (Math.floor(value * multiplier) / multiplier).toString();
  if (value === parseInt(value) && decimals > 0)
    outputString += '.';
  let zeroPadding = decimals === 0 ? 0 : (decimals + 2 - outputString.length)
  for (let i = 0; i < zeroPadding; i++)
    outputString += '0';
  return outputString;
}

export const paletteColors = ['#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#283593', '#1565c0',
  '#03a9f4', '#00838f', '#00695c', '#2e7d32', '#8bc34a', '#cddc39', '#fdd835',
  '#ffa000', '#f57c00', '#e65100', '#5d4037', '#616161', '#455a64'
]

export const getTransactionColor = (address) => {

  let addressHash = createHash('sha256').update(address).digest();
  let txPrefix = addressHash[0] + addressHash[1] * 256;

  return paletteColors[txPrefix % paletteColors.length];
}


export const  getParseDate = (date) => {
  var d = Date.parse(date);
  return Moment(d).calendar()
}

export const  extractHostname = (link) => {
  let urlArr = url.parse(link).hostname.split('.')
  return urlArr.length > 2 ? urlArr[1] : urlArr[0]
}


export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}