import * as React from 'react';
import {
  ActionSheetIOS,
  Platform,
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {TouchableRipple, IconButton} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import ProgressCircle from 'react-native-progress-circle';
import {Picker} from '@react-native-picker/picker';
import Moment from 'moment';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

export default function TransactionsHistoryScreen({navigation}) {
  const {state} = React.useContext(TransactionContext);

  const [modalVisibility, setModalVisibility] = React.useState({
    visibility: false,
    data: undefined,
  });

  const [selectedItem, setSelectedItem] = React.useState('Past 30 days');
  const [selectedValue, setSelectedValue] = React.useState(30);
  const [loading, setLoading] = React.useState([]);
  const [transactionsHistory, setTransactionsHistory] = React.useState([]);
  const [
    filteredTransactionsHistory,
    setFilteredTransactionsHistory,
  ] = React.useState([]);

  const onMenuPress = () => {
    navigation.pop();
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const transactions = await getUserTransactions();
      if (transactions != undefined && transactions != null) {
        const transactionsParse = JSON.parse(transactions)
          .sort(
            (a, b) =>
              Moment(a.time * 1000).format('YYYYMMDD') -
              Moment(b.time * 1000).format('YYYYMMDD'),
          )
          .reverse()
          .filter(
            item =>
              item.time * 1000 >= getSubtractDate(30).getTime() &&
              item.send_amount > 0,
          );
        setTransactionsHistory(transactionsParse);
        setFilteredTransactionsHistory(transactionsParse);
      }
      setLoading(false);
    })();
  }, [state]);

  React.useEffect(() => {
    if (transactionsHistory.length > 0) {
      const filteredList = transactionsHistory.filter(
        item => item.time * 1000 >= getSubtractDate(selectedValue).getTime(),
      );
      if (filteredList.length > 0) {
        setFilteredTransactionsHistory(filteredList);
      }
    }
  }, [selectedValue]);

  const filterTransactionsAction = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Past 30 days', 'Past 14 days', 'Past 7 days'],
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setSelectedItem('Past 30 days');
          setSelectedValue(30);
        } else if (buttonIndex === 2) {
          setSelectedItem('Past 14 days');
          setSelectedValue(14);
        } else if (buttonIndex === 3) {
          setSelectedItem('Past 7 days');
          setSelectedValue(7);
        }
      },
    );
  };

  const search = text => {
    const formattedQuery = text.toLowerCase();
    const data = transactionsHistory.filter(item => {
      return contains(item, formattedQuery);
    });
    setFilteredTransactionsHistory(data);
  };

  const contains = (item, query) => {
    if (
      item.sender.name.toLowerCase().includes(query) ||
      item.receiver.name.toLowerCase().includes(query) ||
      item.send_amount.toString().includes(query) ||
      item.sender.address.toLowerCase().includes(query) ||
      item.receiver.address.toLowerCase().includes(query)
    ) {
      return true;
    }
    return false;
  };

  const getSubtractDate = nrDays => {
    var currentDay = new Date();
    currentDay.setDate(currentDay.getDate() - nrDays);
    return currentDay;
  };

  const closeModal = () => {
    setModalVisibility({visibility: false, data: undefined});
  };

  const showModal = itemData => {
    setModalVisibility({visibility: true, data: itemData});
  };

  return (
    <View style={styles.container}>
      <ToolBar
        title={Strings.TRANSACTION_HISTORY_TOOLBAR_TITLE}
        iconName={Strings.ICON_BACK}
        onMenuPress={onMenuPress}
      />
      {loading ? (
        <ActivityIndicator
          style={{alignSelf: 'center'}}
          size="large"
          color={colors.tintColor}
        />
      ) : transactionsHistory.length === 0 ? (
        <Text style={styles.noTransactionText}>No transactions</Text>
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.searchContainer}>
            <MaterialIcons
              style={{marginStart: 10}}
              name="search"
              size={25}
              color={colors.grey}
            />
            <TextInput
              style={styles.input}
              placeholder={Strings.TRANSACTION_HISTORY_INPUT_HINT_TEXT}
              placeholderTextColor={colors.grey}
              onChangeText={text => search(text)}
            />
          </View>
          <View style={styles.pastcontainer}>
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                activeOpacity={0.5}
                onPress={filterTransactionsAction}>
                <Text style={{marginStart: 10}}>{selectedItem}</Text>
                <MaterialIcons
                  style={{marginEnd: 10}}
                  name="arrow_drop_down"
                  size={15}
                  color={colors.blackColor}
                />
              </TouchableOpacity>
            ) : (
              <Picker
                style={{flex: 1}}
                selectedValue={selectedValue}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedValue(itemValue)
                }
                mode="dropdown">
                <Picker.Item label="Past 30 days" value={30} />
                <Picker.Item label="Past 14 days" value={14} />
                <Picker.Item label="Past 7 days" value={7} />
              </Picker>
            )}
          </View>
          <FlatList
            style={{marginTop: 10, marginBottom: 10}}
            data={filteredTransactionsHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TransactionsHistoryItem itemData={item} showModal={showModal} />
            )}
          />
          <TransactionModal
            visibility={modalVisibility.visibility}
            modalData={modalVisibility.data}
            closeModal={closeModal}
          />
        </View>
      )}
    </View>
  );
}

const TransactionModal = ({visibility, modalData, closeModal}) => (
  <Modal animationType="fade" visible={visibility} transparent={true}>
    {modalData === undefined ? (
      <View />
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onStartShouldSetResponder={() => closeModal()}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white,
            width: 250,
            borderRadius: 15,
          }}>
          <IconButton
            style={{alignSelf: 'flex-end'}}
            icon={'close'}
            size={24}
            color={colors.blackColor}
            onPress={() => closeModal()}
          />

          <Text
            style={{
              color: colors.blackColor,
              fontSize: 16,
              marginStart: 20,
              marginEnd: 20,
              textAlign: 'center',
            }}>
            {Moment(modalData.time * 1000).calendar()}
          </Text>
          <Text
            style={{
              color: colors.blackColor,
              fontSize: 20,
              marginTop: 10,
              marginStart: 20,
              marginEnd: 20,
              textAlign: 'center',
            }}>
            <Text style={{color: colors.grey, fontSize: 16}}>
              {'Sender:\n'}
            </Text>
            {modalData.sender.name === 'No Name'
              ? modalData.sender.address
              : modalData.sender.name}
          </Text>
          <Text
            style={{
              color: colors.blackColor,
              fontSize: 20,
              marginTop: 10,
              marginStart: 20,
              marginEnd: 20,
              textAlign: 'center',
            }}>
            <Text style={{color: colors.grey, fontSize: 16}}>
              {'Receiver:\n'}
            </Text>
            {modalData.receiver.name === 'No Name'
              ? modalData.receiver.address
              : modalData.receiver.name}
          </Text>

          <Text
            style={{
              color: modalData.is_expense
                ? colors.blackColor
                : colors.tintColor,
              fontSize: 20,
              marginTop: 10,
              marginBottom: 20,
              marginStart: 20,
              marginEnd: 20,
              textAlign: 'center',
            }}>
            <Text style={{color: colors.grey, fontSize: 16}}>
              {'Amount:\n'}
            </Text>
            {`${modalData.is_expense ? ' - ' : ' + '}`.concat(
              formatNumber(modalData.send_amount, 2),
            )}
          </Text>
        </View>
      </View>
    )}
  </Modal>
);

const TransactionsHistoryItem = ({itemData, showModal}) => (
  <TouchableRipple
    style={styles.transhistoryitem}
    onPress={() => showModal(itemData)}>
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{width: 15, alignItems: 'center'}}>
        {itemData.confirmations < 6 ? (
          <ProgressCircle
            percent={(itemData.confirmations / 6) * 100}
            radius={8}
            borderWidth={2}
            color={colors.tintColor}
            shadowColor={colors.grey}
            bgColor={colors.white}
          />
        ) : (
          <MaterialIcons name="done" size={15} color={colors.tintColor} />
        )}
        <View
          style={{
            height: 40,
            width: 2,
            marginTop: 5,
            backgroundColor: colors.grey,
          }}
        />
      </View>
      <View style={{marginStart: 10, flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 18,
              color: itemData.is_expense ? colors.grey : colors.blackColor,
            }}>
            {itemData.is_expense
              ? 'You sent'
              : itemData.sender.name === 'No Name'
              ? elipsizeName(itemData.sender.address)
              : elipsizeName(itemData.sender.name)}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginStart: 10,
              color: itemData.is_expense ? colors.blackColor : colors.grey,
            }}>
            {itemData.is_expense
              ? itemData.receiver.name === 'No Name'
                ? elipsizeName(itemData.receiver.address)
                : elipsizeName(itemData.receiver.name)
              : 'sent you'}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Feather name="clock" size={14} color={colors.grey} />
          <Text style={{fontSize: 14, marginStart: 10, color: colors.grey}}>
            {Moment(itemData.time * 1000).calendar()}
          </Text>
        </View>
        {itemData.confirmations < 6 ? (
          <Text style={{fontSize: 12, marginStart: 10, color: colors.grey}}>
            {`Wait for this transaction to be completed`}
          </Text>
        ) : null}
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 16,
            marginStart: 10,
            color: itemData.is_expense ? colors.grey : colors.tintColor,
          }}>
          {`${itemData.is_expense ? ' - ' : ' + '}`.concat(
            formatNumber(itemData.send_amount, 2),
          )}
        </Text>
      </View>
    </View>
  </TouchableRipple>
);

const elipsizeName = name =>
  name.length >= 10 ? `${name.substring(0, 10)}...` : name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.tintColor,
    marginStart: 20,
    marginEnd: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    marginStart: 10,
    color: colors.blackColor,
  },
  anyRewardContainer: {
    height: 50,
    marginStart: 20,
    marginEnd: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  anyView: {
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tintColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anyText: {
    fontSize: 16,
    color: colors.white,
    paddingStart: 20,
    paddingEnd: 20,
  },
  rewardView: {
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.grey,
    backgroundColor: colors.transparent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardText: {
    fontSize: 16,
    color: colors.grey,
    paddingStart: 10,
    paddingEnd: 20,
  },
  pastContainer: {
    height: 40,
    marginStart: 20,
    marginEnd: 20,
    marginTop: 10,
    backgroundColor: colors.light_gray,
    borderRadius: 5,
  },
  transhistoryitem: {
    height: 70,
    alignSelf: 'stretch',
    marginStart: 20,
    marginEnd: 20,
  },
  noTransactionText: {
    fontSize: 23,
    color: colors.tintColor,
    alignSelf: 'center',
    marginTop: 40,
    marginStart: 20,
    marginEnd: 20,
    textAlign: 'center',
  },
});
