
import React,{useContext,useState,useEffect} from 'react';

import { View, Text, StyleSheet, Image, ImageBackground, FlatList, TextInput, ActivityIndicator, Linking, RefreshControl } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
    TouchableRipple
} from 'react-native-paper';
import ToolBar from './ToolBar'

import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';

import { GET_MERCHANTS } from './api/queries/user';

import { createApolloClient } from './api/createApolloClient';


import { getEmptyHeaderOptions } from '../UI/Navbar';

const headerImage = require("../../images/shop_header.png");

const viewWalletImageSource = require("../../images/ic_view_wallet.png");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    headerImage: {
        width:'100%',
        aspectRatio:1.6,
        alignSelf: 'stretch',
    },
    headerContent:{
        backgroundColor:'rgba(0,165,25,0.75)',
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    headerText: {
        fontSize: 30,
        color: colors.white,
        marginBottom: 10,
    },
    headerSubText: {
        fontSize: 16,
        color: colors.white
    },
    itemContainer: {
        flex: 1,
        minHeight: 90,
        flexDirection: 'column',
        overflow: 'hidden',
        borderBottomWidth: 0.2,
        borderColor: colors.light_gray
    },
    itemImage: {
        width: 50,
        height: 50,
        resizeMode: 'center',
        alignSelf: 'center',
        marginTop: 30
    },
    itemTitle: {
        textAlign: 'center',
        color: colors.blackColor,
        fontSize: 18
    },
    itemSubTitle: {
        marginTop: 5,
        textAlign: 'left',
        color: colors.tintColor,
        fontSize: 12
    },
    credential: {
        width: 60,
        height: 60,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: colors.tintColor,
        marginStart: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    credentialText: {
        color: colors.white,
        fontSize: 20
    },
    inputContainer: {
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: colors.light_gray,
        marginEnd: 20,
        marginStart: 20,
        marginTop: 20,
        alignItems: 'center',
        flexDirection: "row"
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        marginStart: 10,
        color: colors.blackColor
    },
    inputTitle: {
        fontSize: 15,
        marginStart: 20,
        marginTop: 20,
        color: colors.tintColor
    },
    imgBG: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover'
    }
})

function ShopScreen({   
    accounts,
	selectedAddress,
	balances,
	tokensWithBalance,
	tokensTopAssets,
	conversionRate,
	tokenExchangeRates,
	currentCurrency }) {

    const navigation = useContext(NavigationContext);


    const client = createApolloClient();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const onMenuPress = () => {
        navigation.toggleDrawer()
    }

    useEffect(() => {
        getMerchants()
    }, []);

    const getMerchants = async () => {
        setLoading(true)
        try {
            const { data } = await client.query({
                query: GET_MERCHANTS
            });
            if (data.merchants.nodes.length > 0) {
                setData(data.merchants.nodes)
                setFilteredData(data.merchants.nodes)
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

    const onRefresh = () => {
        getMerchants()
    }

    const search = (text) => {
        const formattedQuery = text.toLowerCase().trim();
        const tempData = data.filter(item => {
            return contains(item, formattedQuery);
        });
        setFilteredData(tempData)
    }

    const contains = (item, query) => {
        if (item.name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    };

    const itemClicked = (item) => {
        Linking.canOpenURL(item.url).then(supported => {
            if (supported) {
                Linking.openURL(item.url);
            } else {
                // showAlert("We can't open this url: " + item.url)
            }
        });
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={headerImage} style={styles.headerImage}>
                <ToolBar
                    background={colors.transparent}
                    iconName="menu"
                    onMenuPress={onMenuPress} />
                <View style={styles.headerContent}>
                    <Text style={styles.headerText}> {strings('bitg_wallet.shop')}</Text>
                    <Text style={styles.headerSubText}>{strings('bitg_wallet.shop_subtitle')}</Text>
                </View>
            </ImageBackground>
            {
                loading ? null : data.length === 0 ? <Text style={{ textAlign: 'center', fontSize: 20, alignSelf: 'center', marginTop: 20 }}>You don't have any merchants</Text> : <View>
                    <Text style={styles.inputTitle}> {strings('bitg_wallet.find_merchants')} </Text>
                    <View style={[styles.inputContainer, { marginTop: 10 }]}>
                        <MaterialIcons style={{ marginStart: 10 }} name="search" size={26} color={colors.grey} />
                        <TextInput style={styles.input} placeholder= {strings('bitg_wallet.search')} placeholderTextColor={colors.grey} onChangeText={text => search(text)} />
                    </View>
                </View>
            }
            <FlatList
                refreshControl={<RefreshControl
                    refreshing={loading} onRefresh={onRefresh} />}
                style={{ margin: 10 }}
                data={filteredData}
                renderItem={({ item }) => <ItemView itemData={item} itemClicked={itemClicked} />}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

const ItemView = ({ itemData, itemClicked }) => (
    <TouchableRipple style={styles.itemContainer} onPress={() => itemClicked(itemData)}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.credential, { backgroundColor: 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')' }]}>
                <Image source={{ uri: itemData.image }} style={styles.imgBG} />
            </View>
            <View style={{ flex: 1, marginStart: 10, marginEnd: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.itemTitle}>{itemData.name}</Text>
                    <Text style={styles.itemSubTitle}>BROWSE</Text>
                </View>
                <Text style={[styles.itemSubTitle, { color: colors.grey }]}>{itemData.description}</Text>
            </View>
        </View>
    </TouchableRipple>
)



ShopScreen.navigationOptions = ({ navigation }) => getEmptyHeaderOptions();

ShopScreen.propTypes = {
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

export default connect(mapStateToProps)(ShopScreen);