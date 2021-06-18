import React, {useEffect,useState,useContext,useRef} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';



import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';
import { toFixedFloor} from '../../../util/general'

import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Device from '../../../util/Device';

import StepIndicator from 'react-native-step-indicator';


const bit_currency = require('../../../images/bitg.png');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    imgBG: {
        width: 300,
        height: 100,
        resizeMode: "cover",
        marginTop: 50
    },
    sectionContainer: {
        height: 130,
        alignSelf: 'stretch',
        flexDirection: 'row',
        marginStart: 20,
        marginEnd: 20,
        borderColor:colors.grey200,
        borderWidth:1,
        padding:10,
        borderRadius:5,
        marginTop:10,
    },
    sectionSubContainer: {
        flex:1,
    },
    circleContainer: {
        width: 24,
        height: 24,
        borderWidth: 4,
        borderColor: colors.grey200,
        backgroundColor: colors.tintColor,
        borderRadius: 12,
    },
    sectionTitle: {
        color: colors.tintColor,
        fontSize: 14,
        marginStart: 10,
        textTransform:'uppercase'
    },
    sectionSubTitle: {
        color: colors.grey200,
        fontSize: 14,
        marginStart: 10,
        marginTop: 10
    },
    bitgSmallImage: {
        width: 25,
        height: 25,
        marginStart: 10,
        resizeMode:'contain',
        ...Platform.select({ ios: { tintColor: colors.tintColor } })
    },
    credential: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        borderRadius: 25,
        backgroundColor: colors.tintColor,
        marginStart: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    credentialText: {
        color: colors.white,
        fontSize: 18
    }
})


const progress_source = require("../../../images/img_progress.png");
const bitgImageSource = require("../../../images/ic_bitg.png");


const bitg_currency = require('../../../images/ic_bitg.png');

const strokeWidth = 2;

export default function ChainSwapSucess({ currentPage, myCurrentWalletBalance, sendingData, apolloClient, getDataFromApi, setLoaderIndicator, loaderIndicator }) {

    useEffect(() => {
        if (currentPage == 1) {
            if ((sendingData.address === undefined || sendingData.address === null) || sendingData.name === "No Name") {
                (async () => {
                    setLoaderIndicator(true)
                    try {
                        const { data } = await apolloClient.query({
                            query: GET_USER_BY_EITHER_USERNAMES_OR_ADDRESSES,
                            variables: { str: sendingData.name === "No Name" ? sendingData.address : sendingData.name },
                        });
                        if (data.users.nodes.length > 0) {
                            const usInfo = data.users.nodes[0]
                            getDataFromApi({ address: usInfo.bitgAddress, name: usInfo.username })
                        } else {
                            if (sendingData.address === undefined || sendingData.address === null) {
                                getDataFromApi({ address: sendingData.name, name: "No Name" })
                            }
                        }
                    } catch (error) {
                        if (sendingData.address === undefined || sendingData.address === null) {
                            getDataFromApi({ address: sendingData.name, name: "No Name" })
                        }
                    }
                    setLoaderIndicator(false)
                })();
            }
        }
    }, [currentPage]);



    return (
        <ScrollView style={styles.container}>
            {
                loaderIndicator == true ?
                    <ActivityIndicator style={{ alignSelf: 'center' }} size="large" color={colors.tintColor} />
                    :
                    sendingData.address === undefined ? <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20, marginStart: 20, marginEnd: 20 }}>
                        {strings('bitg_wallet.invalid_send_data')}
                        </Text> :
                       

                        < View style={{ flex: 1 }}>
                            <Image style={styles.imgBG} source={progress_source} />
                            <View style={[styles.sectionContainer, { marginTop: 10 }]}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={styles.circleContainer} />
                                    <Text style={{ color: colors.grey200, fontWeight: 'bold' }}>{`|\n|\n|\n|\n|\n|\n`}</Text>
                                </View>
                                <View style={styles.sectionSubContainer}>
                                    <Text style={styles.sectionTitle}>{strings('bitg_wallet.from')}</Text>
                                    <Text style={styles.sectionSubTitle}>{ strings('bitg_wallet.my_primary_wallet')}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                        <Image
                                            style={styles.bitgSmallImage}
                                            source={bitg_currency}
                                            tintColor={Platform === 'ios' ? undefined : colors.tintColor}
                                        />
                                        <Text style={{ fontSize: 30, color: colors.blackColor, marginStart: 5 }}>{toFixedFloor(myCurrentWalletBalance, 3)}</Text>
                                        <Text style={{ fontSize: 30, color: colors.redColor, marginStart: 20 }}>- {sendingData.amount}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.sectionContainer}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={[styles.circleContainer, { backgroundColor: colors.grey200 }]} />
                                    <Text style={{ color: colors.grey200, fontWeight: 'bold' }}>{`|\n|\n|\n|\n|\n|\n`}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionTitle}>{strings('send.title')}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                        <View style={styles.credential}>
                                            <Text style={styles.credentialText}>{sendingData.address === undefined ? "" : sendingData.address.charAt(0)}</Text>
                                        </View>
                                        <Text style={{ fontSize: 20, marginStart: 20, color: colors.blackColor }}>{sendingData.address === undefined ? "" : sendingData.address}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.sectionContainer}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={[styles.circleContainer, { backgroundColor: colors.grey200 }]} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionTitle}>{strings('bitg_wallet.after_balance')}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                        <Image
                                            style={styles.bitgSmallImage}
                                            source={bitg_currency}
                                            tintColor={Platform === 'ios' ? undefined : colors.tintColor}
                                        />
                                        <Text style={{ fontSize: 30, color: colors.blackColor, marginStart: 5, fontWeight: '700' }}>{toFixedFloor((myCurrentWalletBalance - parseFloat(sendingData.amount)), 3)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
            }
        </ScrollView >

    );
}
