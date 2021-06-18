import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar, ProgressBar } from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';

const swap_done = require('../../../images/swap_done.png');

const bitgImageSource = require('../../../images/ic_bitg.png');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},

	swapLogo: {
		resizeMode: 'contain',
		marginTop: 30
	},
	mainContent: {
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
		flexGrow: 1
	},

	progresContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10
	},


	verticalDash:{
		marginVertical:4,
		width:1,
		height:30,
		backgroundColor:colors.green100
	},
	activeCircle: {
		width: 24,
		height: 24,
		borderWidth: 4,
		borderColor: colors.grey100,
		backgroundColor: colors.tintColor,
		borderRadius: 12
	},
	inactiveCircle: {
		width: 24,
		height: 24,
		borderWidth: 4,
		borderColor: colors.grey000,
		backgroundColor: colors.grey000,
		borderRadius: 12
	},

	bitgSmallImage: {
		width: 25,
		height: 25,
		marginStart: 10,
		resizeMode: 'contain',
		...Platform.select({ ios: { tintColor: colors.tintColor } })
	},

	bitgBalanceText: {
		marginStart: 5,
		fontSize: 25,
		color: colors.blackColor
	},

	button: {
		marginBottom: 5,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.green,
		marginTop: 25,
		width: '60%'
	},
	buttonText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		textTransform: 'uppercase'
	},
	title: {
		fontSize: 30,
		alignSelf: 'center',
		color: colors.tintColor,
		marginHorizontal: 20,
		textAlign: 'center'
	},
	textContent: {
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 30
	},
	chainText: {
		marginTop: 10,
		color: colors.green,
		fontSize: 14,
		textAlign: 'center',
		textTransform: 'uppercase'
    },
    desText: {
		marginTop: 10,
		color: colors.grey300,
		fontSize: 14,
		textAlign: 'center',
	},
	balanceContainer: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default function ChainSwapSucess({
	newTransaction,
	currentPage,
	sendingData,
	globalState,
    updateGlobalState,
    balance,
    navigation,
    next,
    goHome
}) {
	const [showModal, setShowModal] = useState(false);
	const [transactionInfo, setTransactionInfo] = useState(undefined);

	useEffect(() => {
		if (currentPage == 2) {
			(async () => {
				transInfo();
			})();
		}
	}, [currentPage]);

	useEffect(() => {
		if (currentPage == 2) {
			updateTransInfo();
		}
	}, [globalState]);

	const updateTransInfo = async () => {
		try {
			if (sendingData.transactionHash != undefined && sendingData.transactionHash != null) {
			}
		} catch (error) {
			console.log(error);
		}
	};

	const transInfo = async () => {
		try {
			if (sendingData.transactionHash != undefined && sendingData.transactionHash != null) {
			}
		} catch (error) {
			console.log(error);
		}
	};

	const copyToClipboard = () => {
		if (sendingData.transactionHash != undefined && sendingData.transactionHash != null) {
		} else {
			// showAlert("You don't have any wallet address!")
		}
    };
    
	return (
		<KeyboardAwareScrollView style={styles.container} contentContainerStyle={styles.mainContent}>
			<Image style={styles.swapLogo} source={swap_done} />

			<View style={styles.textContent}>
				<Text style={styles.title}>{strings('bitg_wallet.chain_swap.success_title')} </Text>

				<View style={styles.progresContainer}>
					<View style={styles.inactiveCircle} />
					<View style={styles.verticalDash} />
					<View style={styles.activeCircle} />
				</View>

				<Text style={styles.chainText}>{strings('bitg_wallet.chain_swap.new_chain')}</Text>

				<View style={styles.balanceContainer}>
					<Image style={styles.bitgSmallImage} source={bitgImageSource} />
					<Text style={styles.bitgBalanceText}>{balance}</Text>
				</View>

                <Text style={styles.desText}>{strings('bitg_wallet.chain_swap.sucess_des')}</Text>
			</View>

			<TouchableOpacity style={styles.button} onPress={goHome}>
				<Text style={styles.buttonText}>{strings('bitg_wallet.chain_swap.return')}</Text>
			</TouchableOpacity>
		</KeyboardAwareScrollView>
	);
}
