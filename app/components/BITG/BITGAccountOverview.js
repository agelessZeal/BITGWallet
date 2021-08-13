import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity, InteractionManager } from 'react-native';
import Clipboard from '@react-native-community/clipboard';

import { connect } from 'react-redux';
import Engine from '../../core/Engine';
import Analytics from '../../core/Analytics';
import AppConstants from '../../core/AppConstants';
import { strings } from '../../../locales/i18n';

import { swapsLivenessSelector } from '../../reducers/swaps';
import { showAlert } from '../../actions/alert';
import { protectWalletModalVisible } from '../../actions/user';
import { toggleAccountsModal, toggleReceiveModal } from '../../actions/modals';
import { newAssetTransaction } from '../../actions/transaction';

import Device from '../../util/Device';
import { ANALYTICS_EVENT_OPTS } from '../../util/analytics';
import { renderFiat } from '../../util/number';
import { renderAccountName } from '../../util/address';
import { isMainNet } from '../../util/networks';
import { getEther } from '../../util/transactions';


import EthereumAddress from '../UI/EthereumAddress';
import Identicon from '../UI/Identicon'
import { colors, fontStyles, baseStyles } from '../../styles/common';


import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';




const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: colors.white,
	},
	wrapper: {
		marginTop: 5,
		paddingBottom: 0,
		alignItems: 'center',
		flexDirection: 'row',
		marginStart: 25,
	},
	info: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		textAlign: 'center',

	},
	data: {
		textAlign: 'center',
		paddingTop: 7,
		paddingStart:7,
	},
	label: {
		fontSize: 22,
		textAlign: 'center',
		...fontStyles.normal
	},
	labelInput: {
		marginBottom: Device.isAndroid() ? -10 : 0
	},
	addressWrapper: {
		backgroundColor: colors.green000,
		borderRadius: 40,
		marginTop: 2,
		marginBottom: 2,
		paddingHorizontal: 15,
		flexDirection: 'row'
	},
	address: {
		fontSize: 12,
		color: colors.grey400,
		...fontStyles.normal,
		letterSpacing: 0.8
	},
	amountFiat: {
		fontSize: 12,
		paddingTop: 5,
		color: colors.fontSecondary,
		...fontStyles.normal
	},
	identiconBorder: {
		borderRadius: 80,
		borderWidth: 2,
		padding: 2,
		borderColor: colors.green
	},
	onboardingWizardLabel: {
		borderWidth: 2,
		borderRadius: 4,
		paddingVertical: Device.isIos() ? 2 : -4,
		paddingHorizontal: Device.isIos() ? 5 : 5,
		top: Device.isIos() ? 0 : -2
	},
	actions: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'row'
	},
	iconButton: {
		marginLeft: 2,
		height: 15,
		width: 15,
		alignItems: 'center',
		justifyContent: 'center'
	},
	icon: {
		width: 15,
		height: 15,
		color: colors.fontSecondary,
		textAlign: 'center',
		marginLeft: 5
	},
	nameContainer: {
		marginTop: 5,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	}
});

/**
 * View that's part of the <Wallet /> component
 * which shows information about the selected account
 */
class BITGAccountOverview extends PureComponent {
	static propTypes = {
		/**
		 * String that represents the selected address
		 */
		selectedAddress: PropTypes.string,
		/**
		/* Identities object required to get account name
		*/
		identities: PropTypes.object,
		/**
		 * Object that represents the selected account
		 */
		account: PropTypes.object,
		/**
		/* Selected currency
		*/
		currentCurrency: PropTypes.string,
		/**
		/* Triggers global alert
		*/
		showAlert: PropTypes.func,
		/**
		 * Action that toggles the accounts modal
		 */
		toggleAccountsModal: PropTypes.func,
		/**
		 * whether component is being rendered from onboarding wizard
		 */
		onboardingWizard: PropTypes.bool,
		/**
		 * Used to get child ref
		 */
		onRef: PropTypes.func,
		/**
		 * Prompts protect wallet modal
		 */
		protectWalletModalVisible: PropTypes.func,
		/**
		 * Start transaction with asset
		 */
		newAssetTransaction: PropTypes.func,
		/**
		/* navigation object required to access the props
		/* passed by the parent component
		*/
		navigation: PropTypes.object,
		/**
		 * Action that toggles the receive modal
		 */
		toggleReceiveModal: PropTypes.func,
		/**
		 * Chain id
		 */
		chainId: PropTypes.string,
		/**
		 * Wether Swaps feature is live or not
		 */
		swapsIsLive: PropTypes.bool,
		/**
		 * Current provider ticker
		 */
		ticker: PropTypes.string
	};

	state = {
		accountLabelEditable: false,
		accountLabel: '',
		originalAccountLabel: ''
	};

	editableLabelRef = React.createRef();
	scrollViewContainer = React.createRef();
	mainView = React.createRef();

	animatingAccountsModal = false;

	toggleAccountsModal = () => {
		const { onboardingWizard } = this.props;
		if (!onboardingWizard && !this.animatingAccountsModal) {
			this.animatingAccountsModal = true;
			this.props.toggleAccountsModal();
			setTimeout(() => {
				this.animatingAccountsModal = false;
			}, 500);
		}
	};

	input = React.createRef();

	componentDidMount = () => {
		const { identities, selectedAddress, onRef } = this.props;
		const accountLabel = renderAccountName(selectedAddress, identities);
		this.setState({ accountLabel });
		onRef && onRef(this);
	};

	setAccountLabel = () => {
		const { PreferencesController } = Engine.context;
		const { selectedAddress } = this.props;
		const { accountLabel } = this.state;
		PreferencesController.setAccountLabel(selectedAddress, accountLabel);
		this.setState({ accountLabelEditable: false });
	};

	onAccountLabelChange = accountLabel => {
		this.setState({ accountLabel });
	};

	setAccountLabelEditable = () => {
		const { identities, selectedAddress } = this.props;
		const accountLabel = renderAccountName(selectedAddress, identities);
		this.setState({ accountLabelEditable: true, accountLabel });
		setTimeout(() => {
			this.input && this.input.current && this.input.current.focus();
		}, 100);
	};

	cancelAccountLabelEdition = () => {
		const { identities, selectedAddress } = this.props;
		const accountLabel = renderAccountName(selectedAddress, identities);
		this.setState({ accountLabelEditable: false, accountLabel });
	};

	copyAccountToClipboard = async () => {
		const { selectedAddress } = this.props;
		await Clipboard.setString(selectedAddress);
		this.props.showAlert({
			isVisible: true,
			autodismiss: 1500,
			content: 'clipboard-alert',
			data: { msg: strings('account_details.account_copied_to_clipboard') }
		});
		setTimeout(() => this.props.protectWalletModalVisible(), 2000);
		InteractionManager.runAfterInteractions(() => {
			Analytics.trackEvent(ANALYTICS_EVENT_OPTS.WALLET_COPIED_ADDRESS);
		});
	};

	onReceive = () => this.props.toggleReceiveModal();

	onSend = () => {
		const { newAssetTransaction, navigation, ticker } = this.props;
		newAssetTransaction(getEther(ticker));
		navigation.navigate('SendFlowView');
	};

	render() {
		const {
			account: { name, address },
			currentCurrency,
			onboardingWizard,
			chainId,
			swapsIsLive
		} = this.props;


		if (!address) return null;
		const { accountLabelEditable, accountLabel } = this.state;

		return (
			<View style={baseStyles.flexGrow} ref={this.scrollViewContainer} collapsable={false}>
				<ScrollView
					bounces={false}
					keyboardShouldPersistTaps={'never'}
					style={styles.scrollView}
					contentContainerStyle={styles.wrapper}
					testID={'account-overview'}
				>
					<TouchableOpacity
						style={styles.identiconBorder}
						disabled={onboardingWizard}
						testID={'wallet-account-identicon'}
					>
						<Identicon address={address} diameter={38} noFadeIn={onboardingWizard} />
					</TouchableOpacity>
					<View style={styles.info} ref={this.mainView}>
						<View ref={this.editableLabelRef} style={styles.data} collapsable={false}>
							{accountLabelEditable ? (
								<TextInput
									style={[
										styles.label,
										styles.labelInput,
										styles.onboardingWizardLabel,
										onboardingWizard ? { borderColor: colors.green } : { borderColor: colors.white }
									]}
									editable={accountLabelEditable}
									onChangeText={this.onAccountLabelChange}
									onSubmitEditing={this.setAccountLabel}
									onBlur={this.setAccountLabel}
									testID={'account-label-text-input'}
									value={accountLabel}
									selectTextOnFocus
									ref={this.input}
									returnKeyType={'done'}
									autoCapitalize={'none'}
									autoCorrect={false}
									numberOfLines={1}
								/>
							) : (
									<TouchableOpacity style={styles.nameContainer} onLongPress={this.setAccountLabelEditable}>
										<Text
											style={[
												styles.label,
												styles.onboardingWizardLabel,
												onboardingWizard
													? { borderColor: colors.green }
													: { borderColor: colors.white }
											]}
											numberOfLines={1}
											testID={'edit-account-label'}
										>
											{name}
										</Text>
										<TouchableOpacity onPress={this.setAccountLabelEditable} style={styles.iconButton}>
											<MaterialCommunityIcon name="pencil" size={15} style={styles.icon} />
										</TouchableOpacity>
									</TouchableOpacity>
								)}
						</View>

						<TouchableOpacity style={styles.addressWrapper} onPress={this.copyAccountToClipboard}>
							<EthereumAddress address={address} style={styles.address} type={'short'} />
							<MaterialCommunityIcon name="content-copy" size={15} style={styles.icon} />
						</TouchableOpacity>

					</View>
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = state => ({
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	identities: state.engine.backgroundState.PreferencesController.identities,
	currentCurrency: state.engine.backgroundState.CurrencyRateController.currentCurrency,
	chainId: state.engine.backgroundState.NetworkController.provider.chainId,
	ticker: state.engine.backgroundState.NetworkController.provider.ticker,
	swapsIsLive: swapsLivenessSelector(state)
});

const mapDispatchToProps = dispatch => ({
	showAlert: config => dispatch(showAlert(config)),
	toggleAccountsModal: () => dispatch(toggleAccountsModal()),
	protectWalletModalVisible: () => dispatch(protectWalletModalVisible()),
	newAssetTransaction: selectedAsset => dispatch(newAssetTransaction(selectedAsset)),
	toggleReceiveModal: asset => dispatch(toggleReceiveModal(asset))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BITGAccountOverview);
