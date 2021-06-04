import React ,{useState,useContext,useEffect} from 'react';
import { View, StyleSheet, FlatList, Image, Text, Linking, RefreshControl } from 'react-native';

import { TouchableRipple } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import url from 'url'


import ToolBar from './ToolBar'

import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';

import { GET_ARTICLES } from './api/queries/user';
import { createApolloClient } from './api/createApolloClient';


import { getBITGNewsNavbarOptions } from '../UI/Navbar';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    itemContainer: {
        flex: 1,
        minHeight: 150,
        flexDirection: 'column',
        overflow: 'hidden',
        borderBottomWidth: 10,
        borderColor: colors.white
    },
    imgBG: {
        flex: 1,
        resizeMode: 'cover'
    }
})


function NewsScreen(props) {

    const navigation = useContext(NavigationContext);

    const client = createApolloClient();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const onMenuPress = () => {
        navigation.pop()
    }

    useEffect(() => {
        getArticle()
    }, []);

    const onRefresh = () => {
        getArticle()
    }

    const getArticle = async () => {
        setLoading(true)
        try {
            const { data } = await client.query({
                query: GET_ARTICLES
            });
            if (data.articles.nodes.length > 0) {
                let arr = data.articles.nodes.sort((a, b) => Moment(a.datePublished).format('YYYYMMDD') - Moment(b.datePublished).format('YYYYMMDD')).reverse()
                setData(arr)
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

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
            {/* <ToolBar title={Strings.NEWS} iconName={Strings.ICON_BACK} onMenuPress={onMenuPress} /> */}
            <FlatList
                refreshControl={<RefreshControl
                    refreshing={loading} onRefresh={onRefresh} />}
                style={{ margin: 10 }}
                data={data}
                renderItem={({ item }) => <ItemView itemData={item} itemClicked={itemClicked} />}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const ItemView = ({ itemData, itemClicked }) => (
    <TouchableRipple style={styles.itemContainer} onPress={() => itemClicked(itemData)}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 2, backgroundColor: colors.transparent }}>
                <Image source={{ uri: itemData.image }} style={styles.imgBG} />
            </View>
            <View style={{ flex: 4, marginStart: 10, justifyContent: 'flex-start' }}>
                <Text numberOfLines={1} style={{ marginEnd: 10, fontSize: 18, fontWeight: 'bold' }}>{itemData.header}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                    <Text style={{ fontSize: 16 }}>
                        {
                            capitalizeFirstLetter(extractHostname(itemData.url))
                        }
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginStart: 10 }}>
                        <Feather name="clock" size={14} color={colors.grey} />
                        <Text style={{ fontSize: 14, marginStart: 5, color: colors.grey }}>
                            {getParseDate(itemData.datePublished)}
                        </Text>
                    </View>
                </View>
                <Text numberOfLines={3} style={{ fontSize: 12, marginTop: 5 }}>
                    {itemData.description}
                </Text>
            </View>
        </View>
    </TouchableRipple>
)

function getParseDate(date) {
    var d = Date.parse(date);
    return Moment(d).calendar()
}

function extractHostname(link) {
    let urlArr = url.parse(link).hostname.split('.')
    return urlArr.length > 2 ? urlArr[1] : urlArr[0]
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

NewsScreen.navigationOptions = ({ navigation }) =>  getBITGNewsNavbarOptions('bitg_wallet.news',navigation);

NewsScreen.propTypes = {
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

export default connect(mapStateToProps)(NewsScreen);

