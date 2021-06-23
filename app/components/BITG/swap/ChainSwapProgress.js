import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';

import { strings } from '../../../../locales/i18n';
import { colors, fontStyles } from '../../../styles/common';


import { NavigationContext } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Device from '../../../util/Device';

import StepIndicator from 'react-native-step-indicator';

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
		flexGrow: 1,
	},

	progresContainer: {
		justifyContent:'center',
		alignItems:'center',
		marginTop: 10,
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
		borderColor: colors.grey100,
		backgroundColor: colors.grey100,
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
		marginStart:5,
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
		paddingHorizontal: 20,
	},
	chainText:{
		marginTop:10,
		color:colors.green,
		fontSize:14,
		textAlign:'center',
		textTransform:'uppercase'
	},
	balanceContainer:{
		marginTop:10,
		flexDirection: 'row', 
		justifyContent: 'center',
		alignItems: 'center'
	}
});


const swap_logo = require('../../../images/swap_logo.png');

const bitgImageSource = require('../../../images/ic_bitg.png');

const strokeWidth = 2;


export default function ChainSwapSucess({
	currentPage,
	myCurrentWalletBalance,
	sendingData,
	apolloClient,
	setLoaderIndicator,
	loaderIndicator,
	next
}) {
	useEffect(() => {
		if (currentPage == 1) {
		}
	}, [currentPage]);


	const [balance,setBalance] =  useState(myCurrentWalletBalance)

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.mainContent}>
			{loaderIndicator == true ? (
				<ActivityIndicator style={{ alignSelf: 'center' }} size="large" color={colors.tintColor} />
			) : (
				<>
					<Image style={styles.swapLogo} source={swap_logo} />

					<View style={styles.textContent}>

						<Text style={styles.title}>{strings('bitg_wallet.chain_swap.confirm')} </Text>

						<Text style={styles.chainText}>{strings('bitg_wallet.chain_swap.old_chain')}</Text>

						<View style={styles.balanceContainer}>
							<Image style={styles.bitgSmallImage} source={bitgImageSource} />
							<Text style={styles.bitgBalanceText}>{balance}</Text>
						</View>

						<View style={styles.progresContainer}>
							<View style={styles.activeCircle} />
							<View style={styles.verticalDash} />
							<View style={styles.inactiveCircle} />
						</View>

						<Text style={styles.chainText}>{strings('bitg_wallet.chain_swap.new_chain')}</Text>


						<View style={styles.balanceContainer}>
							<Image style={styles.bitgSmallImage} source={bitgImageSource} />
							<Text style={styles.bitgBalanceText}>{balance}</Text>
						</View>

					</View>

					<TouchableOpacity style={styles.button} onPress={next}>
						<Text style={styles.buttonText}>{strings('send.confirm')}</Text>
					</TouchableOpacity>
				</>
			)}
		</ScrollView>
	);
}
