import * as React from 'react';

import { Text, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';

const STATUSBAR_HEIGHT = getStatusBarHeight();

export default function ToolBar({ background = colors.tintColor, title, iconName, onMenuPress, hideRightButtons = true, onSearchPress, onAddPress, isOnModal = false }) {
    return (
        <View style={[styles.container, { backgroundColor: background, height: isOnModal ? (Platform.OS === "ios" ? STATUSBAR_HEIGHT : 0) + 60 : STATUSBAR_HEIGHT + 60 }]}>
            <View style={[styles.subContainer, { backgroundColor: background }]}>
                <View style={styles.leftContainer}>
                    <TouchableOpacity style={styles.menuIcon} onPress={() => onMenuPress()}>
                        <MaterialIcons name={iconName} size={24} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.text}>{title}</Text>
                </View>
                {
                    hideRightButtons ? null :
                        <View style={styles.rightContainer}>
                            <TouchableOpacity style={styles.menuIcon} onPress={() => onAddPress()}>
                                <MaterialIcons name="add" size={26} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: STATUSBAR_HEIGHT + 60,
        justifyContent: 'flex-end',
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        backgroundColor:'red',
        zIndex:20,
    },
    subContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.tintColor
    },
    leftContainer: {
        marginStart: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightContainer: {
        marginEnd: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginStart: 20,
        color: colors.white,
        fontSize: 18
    },
    menuIcon: {
        width: 45,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    }
})