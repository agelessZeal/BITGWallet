import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

import Modal from 'react-native-modal';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default function QRCodeScreen({ visibility, closeModal, getDataFromQRCode }) {
    const qrCodeRef = React.useRef();

    const handleBarCodeScanned = async e => {
        getDataFromQRCode(e.data)
        closeModal()
    };

    return (
        <Modal style={{ margin: 0 }} isVisible={visibility} hasBackdrop={false}>
            <View style={styles.container}>
                <ToolBar title={Strings.QR_CODE_TOOLBAR_TITLE} iconName={Strings.ICON_BACK} onMenuPress={closeModal} isOnModal={true} />
                <View style={styles.cameraContainer}>
                    <QRCodeScanner
                        ref={qrCodeRef}
                        onRead={handleBarCodeScanned}
                        topViewStyle={styles.zeroContainer}
                        bottomViewStyle={styles.zeroContainer}
                        cameraStyle={{ height: Dimensions.get('window').height }}
                        flashMode={RNCamera.Constants.FlashMode.auto} />
                    <View style={styles.overlayCamera}>
                        <View style={styles.innerBox} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    errorText: {
        alignSelf: 'center',
        marginTop: 30,
        fontSize: 30,
        color: colors.blackColor,
        textAlign: 'center'
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlayCamera: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#00000090'
    },
    innerBox: {
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').width - 50,
        backgroundColor: colors.transparent,
        borderWidth: 2,
        borderColor: colors.white
    },
    zeroContainer: {
        height: 0,
        flex: 0,
    }
})