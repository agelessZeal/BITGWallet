import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

export default function BackupWalletScreen({ navigation }) {

    const onMenuPress = () => {
        navigation.pop()
    }

    return (
        <View style={styles.container}>
            <ToolBar title={Strings.BACK_UP_WALLET} iconName={Strings.ICON_BACK} onMenuPress={onMenuPress} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="lock" size={100} color={colors.tintColor} />
                <Text style={styles.title}>{Strings.BACK_UP_WALLET_TITLE}</Text>
                <TouchableOpacity style={styles.showMnemonicButton} activeOpacity={0.5} onPress={() => { }}>
                    <Text style={styles.textButtons}>{Strings.BACK_UP_WALLET_BUTTON_TEXT}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    viewWalletImage: {
        width: 125,
        height: 138,
        marginTop: 50
    },
    title: {
        color: colors.tintColor,
        textAlign: 'center',
        fontSize: 30,
        marginTop: 20
    },
    showMnemonicButton: {
        height: 50,
        alignSelf: 'center',
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginTop: 50
    },
    textButtons: {
        fontSize: 18,
        color: colors.white,
        paddingStart: 30,
        paddingEnd: 30
    },
})