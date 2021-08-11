
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar, ProgressBar } from 'react-native-paper';
import Clipboard from "@react-native-community/clipboard";
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';


import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

import { showAlert } from '../../../actions/alert';


const file_dollar_source = require("../../../images/ic_file_dollar.png");
const update_status = require("../../../images/ic_update_24px.png");


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    tickCircle: {
        width: 80,
        height: 80,
        overflow: 'hidden',
        borderRadius: 40,
        backgroundColor: colors.tintColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    titleText: {
        textAlign: 'center',
        fontSize: 30,
        marginTop: 20,
        color: colors.black
    },
    subTitleText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 10,
        color: colors.grey500,
        marginStart: 20,
        marginEnd: 20
    },
    card: {
        height: 250,
        alignSelf: 'stretch',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#fbfbfb",
        marginStart: 20,
        marginEnd: 20,
        marginTop: 20,
        borderColor: colors.grey200
    },
    transactionButton: {
        height: 50,
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginTop: 30,
        marginBottom: 20,
    },
    textButtons: {
        fontSize: 18,
        color: colors.white,
        paddingStart: 30,
        paddingEnd: 30,
        textTransform:'uppercase'
    },
    progressBar: {
        width: 200,
        height: 6,
        borderRadius: 3,
        marginTop: 5,
        marginStart: 5,
        backgroundColor: colors.progressColor
    },
    buttonContainer: {
        height: 50,
        marginBottom: 10,
        marginStart: 20,
        marginEnd: 20,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    buttons: {
        height: 50,
        paddingStart: 10,
        paddingEnd: 10,
        borderRadius: 25,
        backgroundColor: colors.transparent,
        borderWidth: 2,
        borderColor: colors.grey200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: colors.grey500,
        padding: 10,
        textTransform:'uppercase'
    },
})


export default function PaymentSendScreen({ newTransaction, currentPage,navigation, sendingData, viewTransactionHistory, globalState, updateGlobalState ,showAlert}) {

    const [showModal, setShowModal] = useState(false)
    const [transactionInfo, setTransactionInfo] = useState(undefined);

    useEffect(() => {
        if (currentPage == 2) {
            (async () => {
                transInfo()
            })();
        }
    }, [currentPage]);


    useEffect(() => {
        if (currentPage == 2) {
            updateTransInfo()
        }
    }, [globalState]);


    const updateTransInfo = async () => {
        try {
            if (sendingData.transactionHash != undefined && sendingData.transactionHash != null) {

            }
        } catch (error) {
            console.log(error);
        }
    }

    const transInfo = async () => {
        try {
            if (sendingData.transactionHash != undefined && sendingData.transactionHash != null) {

            }
        } catch (error) {
            console.log(error);
        }
    }


    const viewTransaction =  async () => {
        if (sendingData.transactionHash != undefined && sendingData.transactionHash != null) {
            // navigatoin.navigate('TransactionDetail')
            navigation.navigate('TransactionDetail', { hash: sendingData.transactionHash})

        } else {
            // showAlert("You don't have any wallet address!")
        }
    }

    const copyToClipboard =  async () => {
        if (sendingData.transactionHash != undefined && sendingData.transactionHash != null) {
            await Clipboard.setString(sendingData.transactionHash);
            showAlert({
                isVisible: true,
                autodismiss: 1500,
                content: 'clipboard-alert',
                data: { msg: strings('transactions.hash_copied_to_clipboard') }
            });
        } else {
            // showAlert("You don't have any wallet address!")
        }
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.tickCircle}>
                    <MaterialIcons name="done" size={50} color={colors.white} />
                </View>
                <Text style={styles.titleText}> {strings('bitg_wallet.payment_sent')}</Text>
                <Text style={styles.subTitleText}>{strings('bitg_wallet.payment_sub_title')}</Text>
                <View style={styles.card}>
                    <View style={{ flex: 1, margin: 20, flexDirection: 'row' }}>
                        <Image
                            style={{ width: 50, height: 58 }}
                            source={file_dollar_source}
                        />
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginStart: 10 }}>
                                <Feather name="clock" size={18} color={colors.grey400} />
                                <Text style={{ fontSize: 16, marginStart: 5, color: colors.grey }}>
                                    {
                                        transactionInfo === undefined ? "" : "Today at".concat(" ", Moment(transactionInfo.time ? (transactionInfo.time * 1000) : Date.now()).locale('en').format('HH:mm A'))
                                    }
                                </Text>
                            </View>
                            <Text style={{ fontSize: 16, marginStart: 10, color: colors.blackColor, marginTop: 5 }} >{ strings('bitg_wallet.transaction_id')}</Text>
                            <Text style={{ fontSize: 16, marginStart: 10, color: colors.blackColor, marginTop: 5 }} numberOfLines={2}>
                                {sendingData.transactionHash}
                            </Text>
                            <View style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginStart: 10, marginTop: 10 }}>
                                {/* <Feather name="clock" size={20} color={colors.redColor} /> */}
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={update_status}
                                />
                                <View style={{ alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 16, marginStart: 5, color: colors.grey400 }}>
                                        {
                                            transactionInfo === undefined ? "0 of 0 confirmations" :
                                                transactionInfo.confirmations <= 6 ? transactionInfo.confirmations.toString().concat(" of 6 ", "confirmations") : "6 of 6 confirmations"
                                        }
                                    </Text>
                                    <ProgressBar
                                        style={styles.progressBar}
                                        progress={transactionInfo === undefined ? 0 : transactionInfo.confirmations <= 6 ? transactionInfo.confirmations / 6 : 1}
                                        color={colors.tintColor} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttons} activeOpacity={0.4} onPress={viewTransaction}>
                            <Text style={styles.buttonText}> { strings('bitg_wallet.view')} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttons} activeOpacity={0.4} onPress={copyToClipboard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="content-copy" size={24} color={colors.grey400} />
                                <Text style={styles.buttonText}>{ strings('bitg_wallet.copy')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.transactionButton} onPress={newTransaction} activeOpacity={0.5} >
                    <Text style={styles.textButtons}>{ strings('bitg_wallet.payment_button')}</Text>
                </TouchableOpacity>
                <Snackbar visible={showModal}>
                    You successfully copied the address!
                </Snackbar>
            </View>
        </KeyboardAwareScrollView>
    );
}
