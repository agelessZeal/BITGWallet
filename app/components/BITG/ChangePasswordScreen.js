import * as React from 'react';
import {
    KeyboardAvoidingView,
    Platform, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';
import { sleep, setUnlockPassword, getUnlockPassword } from '../lib/Helpers';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

export default function ChangePasswordScreen({ navigation }) {

    const [loading, setLoading] = React.useState(false);

    const [currentPassword, setCurrentPassword] = React.useState(undefined);
    const [newPassword, setNewPassword] = React.useState(undefined);
    const [confirmPassword, setConfirmPassword] = React.useState(undefined);

    const [savedPassword, setSavedPassword] = React.useState(undefined);
    const [biometryType, setBiometryType] = React.useState(undefined);

    const onMenuPress = () => {
        navigation.pop()
    }

    React.useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                // Retreive the credentials
                await sleep(200)
                const bioType = await Keychain.getSupportedBiometryType({})
                setBiometryType(bioType)
                await sleep(200)
                const options = {
                    accessControl: (bioType === undefined || bioType === null) ? null : Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
                    authenticationPrompt: {
                        title: 'Authentication needed',
                        subtitle: 'BitG',
                        description: 'Unlock your wallet!',
                        cancel: 'Cancel',
                    },
                };
                const credentials = await Keychain.getGenericPassword(options);
                if (credentials) {
                    setSavedPassword(credentials.password)
                    setCurrentPassword(credentials.password)
                } else {
                    console.log('No credentials stored')
                }
            } catch (error) {
                console.log('Keychain couldn\'t be accessed!', error);
            } finally {
                const password = await getUnlockPassword()
                if (password != undefined && password != null) {
                    setSavedPassword(password)
                    setCurrentPassword(password)
                }
            }
            setLoading(false)
        })();
    }, []);

    const save = async () => {
        if (savedPassword === undefined) {
            changePassword();
        } else {
            if (savedPassword == currentPassword) {
                changePassword();
            } else {
                //TODO Handle Wrong current password alert
                showErrorAlert("Please write your previous password correctly!")
            }
        }
    }

    const showErrorAlert = (message) => {
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

    const changePassword = async () => {
        if (newPassword != undefined && newPassword.length > 0) {
            if (confirmPassword != undefined && confirmPassword.length > 0) {
                if (newPassword == confirmPassword) {
                    setLoading(true)
                    await sleep(200)
                    try {
                        await Keychain.setGenericPassword(
                            'bitgMobile',
                            newPassword,
                            {
                                accessControl: (biometryType === undefined || biometryType === null) ? null : Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
                            }
                        );
                        await setUnlockPassword(newPassword)
                        showErrorAlert(savedPassword == undefined ? "Your password successfully saved!" : "Your password successfully changed!")
                    } catch (error) {
                        showErrorAlert("Failed to set unlock password")
                    }
                    setLoading(false)
                } else {
                    showErrorAlert("Your new password and confirm password do not match!")
                }
            } else {
                showErrorAlert("Please add confirm password")
            }
        } else {
            showErrorAlert("Please add new password")
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <ToolBar title={Strings.CHANGE_PASSWORD_SCREEN} iconName={Strings.ICON_BACK} onMenuPress={onMenuPress} />
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingBottom: 20, alignItems: 'center' }}>
                    <MaterialIcons style={{ marginTop: 60 }} name="lock" size={90} color={colors.tintColor} />
                    <Text style={styles.walletTitle}>
                        {savedPassword === undefined ? Strings.SET_WALLET_PASSWORD_TITLE : Strings.CHANGE_WALLET_PASSWORD_TITLE}
                    </Text>
                </View>
                {
                    savedPassword === undefined ? null : <View style={[styles.inputContainer, { marginTop: 10 }]}>
                        <MaterialIcons style={{ marginStart: 10 }} name="vpn-key" size={30} color={colors.grey} />
                        <TextInput
                            style={styles.input}
                            secureTextEntry={true}
                            placeholder={Strings.CURRENT_PASSWORD_HINT}
                            placeholderTextColor={colors.grey}
                            onChangeText={text => setCurrentPassword(text)}
                            defaultValue={""} />
                    </View>
                }
                {
                    savedPassword === undefined ? null : <Text style={{ marginStart: 40, color: colors.grey, fontWeight: 'bold' }}>{`|\n|\n|`}</Text>
                }
                <View style={[styles.inputContainer, { marginTop: 0 }]}>
                    <MaterialIcons style={{ marginStart: 10 }} name="vpn-key" size={30} color={colors.grey} />
                    <TextInput style={styles.input} secureTextEntry={true} placeholder={Strings.NEW_PASSWORD_HINT} placeholderTextColor={colors.grey} onChangeText={text => setNewPassword(text)} />
                </View>
                <View style={styles.inputContainer}>
                    <MaterialIcons style={{ marginStart: 10 }} name="vpn-key" size={30} color={colors.grey} />
                    <TextInput style={styles.input} secureTextEntry={true} placeholder={Strings.CONFIRM_PASSWORD_HINT} placeholderTextColor={colors.grey} onChangeText={text => setConfirmPassword(text)} />
                </View>
                {
                    loading ? <ActivityIndicator style={{ alignSelf: 'center', marginTop: 20 }} size="large" color={colors.tintColor} /> :
                        <TouchableOpacity style={styles.setButton} activeOpacity={0.5} onPress={() => { save() }}>
                            <Text style={styles.textButton}>{Strings.SET_PASSWORD_BUTTON_TEXT}</Text>
                        </TouchableOpacity>
                }

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    walletTitle: {
        fontSize: 25,
        color: colors.tintColor,
        textAlign: 'center',
        marginTop: 10
    },
    inputContainer: {
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: colors.transparent,
        marginEnd: 40,
        marginStart: 40,
        marginTop: 20,
        borderColor: colors.tintColor,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: "row"
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 18,
        marginStart: 10,
        color: colors.blackColor
    },
    setButton: {
        height: 50,
        width: 200,
        borderRadius: 25,
        marginTop: 30,
        backgroundColor: colors.tintColor,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    textButton: {
        fontSize: 16,
        color: colors.white
    },
    textButtons: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.grey
    },
    biometricsButton: {
        height: 30,
        alignSelf: 'stretch',
        backgroundColor: colors.transparent,
        alignItems: 'center',
        justifyContent: 'center',
        marginEnd: 5,
        marginTop: 5
    },
    hideView: {
        opacity: 0.0
    }
})