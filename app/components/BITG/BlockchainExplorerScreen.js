import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

const bgImageSource = require("../../images/img_block_chain_explorer.png");

export default function BlockchainExplorerScreen({ navigation }) {
    const onMenuPress = () => {
        navigation.toggleDrawer()
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image style={styles.imageBG} source={bgImageSource} />
                <View style={styles.valueContainer}>
                    <TouchableOpacity style={styles.arrowButtons} activeOpacity={0.5} onPress={() => { }}>
                        <MaterialIcons name="arrow_back" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.valueText}>576,0031</Text>
                    <TouchableOpacity style={styles.arrowButtons} activeOpacity={0.5} onPress={() => { }}>
                        <MaterialIcons name="arrow_forward" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center'
    },
    imageBG: {
        width: 294,
        height: 184,
        marginTop: 40
    },
    valueContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginStart: 30,
        marginEnd: 30
    },
    arrowButtons: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.grey,
        alignItems: 'center',
        justifyContent: 'center'
    },
    valueText: {
        fontSize: 30,
        color: colors.blackColor
    }
})