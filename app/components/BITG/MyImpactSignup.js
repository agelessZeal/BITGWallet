import React, { useEffect, useCallback, useState, useContext, PureComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity ,TextInput} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strings } from '../../../locales/i18n';
import { colors, fontStyles } from '../../styles/common';
import { NavigationContext } from 'react-navigation';
import StyledButton from '../UI/StyledButton';
import { getBITGWalletNavbarOptions } from '../UI/Navbar';
import { getPasswordStrengthWord } from "../../util/password";
import Icon from 'react-native-vector-icons/FontAwesome';
import zxcvbn from 'zxcvbn';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		padding:20,
	},
	header: {
		margin: 20,
		marginTop:30,
		alignItems: 'center',
		justifyContent:'center',
	},

	buttonContainer:{
		marginTop:20,
		marginHorizontal:20,
		width:'100%',
		flexDirection:'row',
		justifyContent:'center'
		
    },
    buttonVibWrapper:{
		width:90,
        borderRadius:5,
        backgroundColor:colors.orange,
        height:90,
        justifyContent:'center',
		alignItems:'center',
		marginHorizontal:10,
	},
	buttonShopWrapper:{
        width:90,
        borderRadius:5,
        backgroundColor:colors.blue,
        height:90,
        justifyContent:'center',
		alignItems:'center',
		marginHorizontal:10,
	},
	buttonText:{
        marginTop:10,
        color:colors.white
	},
	buttonImage:{
        resizeMode:'contain',
        width: 30,
        height:30,
	},
	startImage:{
		resizeMode:'contain',
        width: 60,
		height:60,
		tintColor:colors.orange
	},
	impactTitle:{
		color:colors.green,
		textTransform:'uppercase',
		fontSize:16,
		marginTop:20,
	},
	othersDescription:{
		color:colors.grey300,
		fontSize:14,
		marginTop:20,
	},
	ctaWrapper: {
		flex: 1,
		flexGrow:1,
		marginTop: 20,
		paddingHorizontal: 40
	},
	field: {
		position: 'relative',
		marginTop:10,
	},
	input: {
		marginTop:10,
		borderWidth: 1,
		borderColor: colors.grey100,
		padding: 10,
		borderRadius: 6,
		fontSize: 14,
		height: 50,
		...fontStyles.normal
	},
	errorMsg: {
		color: colors.red,
		...fontStyles.normal
	},
	hintLabel: {
		height: 20,
		fontSize: 12,
		marginTop:5,
		color: colors.green,
		textAlign: 'left',
		textTransform:'uppercase',
		...fontStyles.normal
	},
	subTitle: {
		height: 20,
		fontSize: 16,
		color: colors.green,
		textAlign: 'left',
		textTransform:'uppercase',
		...fontStyles.normal
	},
	showPassword: {
		position: 'absolute',
		top: 0,
		right: 0
	},
	// eslint-disable-next-line react-native/no-unused-styles
	strength_weak: {
		color: colors.red
	},
	// eslint-disable-next-line react-native/no-unused-styles
	strength_good: {
		color: colors.green
	},
	// eslint-disable-next-line react-native/no-unused-styles
	strength_strong: {
		color: colors.green
	},
	showEmailCorrect: {
		position: 'absolute',
		top: 47,
		right: 17,
		alignSelf: 'flex-end'
	},
});

const bitgImageSource = require('../../images/ic_bitg.png');
const impactImageSource = require('../../images/ic_stars_24px.png');
const initiativeImageSource = require('../../images/ic_vibration_24px.png');
const shopImageSource = require('../../images/ic_store_mall_directory_24px.png');

class MyImpactSignup extends PureComponent {

	static navigationOptions = ({ navigation }) => getBITGWalletNavbarOptions('bitg_wallet.my_impact', navigation);

	static propTypes = {
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

	state = {
		isSelected: false,
		email: '',
		password:'',
		loading: false,
		error: null,
		inputWidth: { width: '99%' },
		secureTextEntry: true,
		ready: true,
		passwordStrength:0

	};

	mounted = true;

	passwordInputRef = React.createRef();


	onPressStart = async () => {
		this.props.navigation.navigate('MyImpactDash');
	}

	onPasswordChange = val => {
		const passInfo = zxcvbn(val);

		this.setState({ password: val, passwordStrength: passInfo.score });
	};

	onEmailChange = val => {
		this.setState({ email: val });
	};

	toggleShowHide = () => {
		this.setState(state => ({ secureTextEntry: !state.secureTextEntry }));
	};

	jumpToPassword = () => {
		const { current } = this.passwordInputRef;
		current && current.focus();
	};

	goToShopViews = () => {
		this.props.navigation.navigate('ShopScreen');
	}

	goToInitiativesViews = () => {
		this.props.navigation.navigate('ImpactInitiativesScreen');
	}

	render() {

		const {
			isSelected,
			inputWidth,
			email,
			password,
			error,
			loading,
			secureTextEntry,
			passwordStrength
		} = this.state;

		const emailCorrect =  email !== '';


		const correctInputed = emailCorrect && password !== '';
		const canSubmit = correctInputed;

		


		const passwordStrengthWord = getPasswordStrengthWord(passwordStrength);

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Image  source={impactImageSource} style={styles.startImage}/>

					<TouchableOpacity  >
						<Text style={styles.impactTitle}>{strings('bitg_wallet.signup_impact_portal')}</Text>
					</TouchableOpacity>

					<Text style={styles.othersDescription}>{strings('bitg_wallet.signup_impact_others')}</Text>

					<View style={styles.buttonContainer}>
							<TouchableOpacity style={styles.buttonVibWrapper} onPress={this.goToInitiativesViews}>
								<Image  source={initiativeImageSource} style={styles.buttonImage}/>
								<Text style={styles.buttonText}>{strings('bitg_wallet.initiatives')}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.buttonShopWrapper}  onPress={this.goToShopViews}>
								<Image  source={shopImageSource} style={styles.buttonImage}/>
								<Text style={styles.buttonText}>{strings('bitg_wallet.shop')}</Text>
							</TouchableOpacity>
					</View>
				</View>


				<View style={styles.field}>
					<Text style={styles.subTitle}>{strings('bitg_wallet.email_address')}</Text>
					<TextInput
						
						style={[styles.input, inputWidth]}
						value={email}
						onChangeText={this.onEmailChange}
						secureTextEntry={false}
						placeholder={''}
						placeholderTextColor={colors.grey100}
						testID={'input-password-confirm'}
						onSubmitEditing={this.jumpToPassword}
						returnKeyType={'next'}
						autoCapitalize="none"
					/>
					<View style={styles.showEmailCorrect}>
						{emailCorrect ? (
							<Icon name="check" size={16} color={colors.green} />
						) : null}
					</View>

				</View>



				<View style={styles.field}>
					<Text style={styles.subTitle}>{strings('password_reset.password_title')}</Text>
					<Text onPress={this.toggleShowHide} style={[styles.hintLabel, styles.showPassword]}>
						{strings(`reset_password.${secureTextEntry ? 'show' : 'hide'}`)}
					</Text>
					<TextInput
						ref={this.passwordInputRef}
						style={[styles.input, inputWidth]}
						value={password}
						onChangeText={this.onPasswordChange}
						secureTextEntry={secureTextEntry}
						placeholder=""
						testID="input-password"
						onSubmitEditing={this.onPressStart}
						returnKeyType="done"
						autoCapitalize="none"
					/>

					<Text style={styles.hintLabel}>
						{strings('reset_password.must_be_at_least', { number: 8 })}
					</Text>

					{(password !== '' && (
						<Text style={styles.hintLabel}>
							{strings('reset_password.password_strength')}
							<Text style={styles[`strength_${passwordStrengthWord}`]}>
								{' '}
								{strings(`reset_password.strength_${passwordStrengthWord}`)}
							</Text>
						</Text>
					)) || <Text style={styles.hintLabel} />}
				</View>


				<View style={styles.ctaWrapper}>
					<StyledButton
						type={'blue'}
						onPress={this.onPressStart}
						testID={'submit-button'}
						disabled={!canSubmit}
					>
						{strings('onboarding_carousel.get_started')}
					</StyledButton>
				</View>

			</View>
		);
	}
}

const mapStateToProps = state => ({
	swapsTokens: state.engine.backgroundState.SwapsController.tokens,
	accounts: state.engine.backgroundState.AccountTrackerController.accounts,
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	balances: state.engine.backgroundState.TokenBalancesController.contractBalances,
	conversionRate: state.engine.backgroundState.CurrencyRateController.conversionRate,
	tokenExchangeRates: state.engine.backgroundState.TokenRatesController.contractExchangeRates,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency
});

export default connect(mapStateToProps)(MyImpactSignup);
