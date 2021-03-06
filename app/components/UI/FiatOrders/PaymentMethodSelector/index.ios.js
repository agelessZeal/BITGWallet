import React, { useContext, useCallback } from 'react';
import { InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationContext } from 'react-navigation';
import { connect } from 'react-redux';
import { strings } from '../../../../../locales/i18n';
import Analytics from '../../../../core/Analytics';
import { ANALYTICS_EVENT_OPTS } from '../../../../util/analytics';

import { useTransakFlowURL } from '../orderProcessor/transak';
import { WYRE_IS_PROMOTION } from '../orderProcessor/wyreApplePay';
import { getPaymentSelectorMethodNavbar } from '../../Navbar';

import ScreenView from '../components/ScreenView';
import Heading from '../components/Heading';

import Text from '../../../Base/Text';
import Title from '../components/Title';
import SubHeader from '../components/SubHeader';

import TransakPaymentMethod from './transak';
import WyreApplePayPaymentMethod from './wyreApplePay';
import { setGasEducationCarouselSeen } from '../../../../actions/user';

function PaymentMethodSelectorView({
	selectedAddress,
	network,
	gasEducationCarouselSeen,
	setGasEducationCarouselSeen,
	...props
}) {
	const navigation = useContext(NavigationContext);
	const transakURL = useTransakFlowURL(selectedAddress);

	const onPressWyreApplePay = useCallback(() => {
		const goToApplePay = () => navigation.navigate('PaymentMethodApplePay');
		if (!gasEducationCarouselSeen) {
			navigation.navigate('GasEducationCarousel', {
				navigateTo: goToApplePay
			});
			setGasEducationCarouselSeen();
		} else {
			goToApplePay();
		}

		InteractionManager.runAfterInteractions(() => {
			Analytics.trackEvent(ANALYTICS_EVENT_OPTS.PAYMENTS_SELECTS_APPLE_PAY);
		});
	}, [navigation, gasEducationCarouselSeen, setGasEducationCarouselSeen]);

	const onPressTransak = useCallback(() => {
		const goToTransakFlow = () =>
			navigation.navigate('TransakFlow', {
				url: transakURL,
				title: strings('fiat_on_ramp.transak_webview_title')
			});

		if (!gasEducationCarouselSeen) {
			navigation.navigate('GasEducationCarousel', {
				navigateTo: goToTransakFlow
			});
			setGasEducationCarouselSeen();
		} else {
			goToTransakFlow();
		}

		InteractionManager.runAfterInteractions(() => {
			Analytics.trackEvent(ANALYTICS_EVENT_OPTS.PAYMENTS_SELECTS_DEBIT_OR_ACH);
		});
	}, [navigation, transakURL, gasEducationCarouselSeen, setGasEducationCarouselSeen]);

	return (
		<ScreenView>
			<Heading>
				<Title centered hero>
					{WYRE_IS_PROMOTION ? (
						<>
							<Text reset>{strings('fiat_on_ramp.purchase_method_title.wyre_first_line')}</Text>
							{'\n'}
							<Text reset>{strings('fiat_on_ramp.purchase_method_title.wyre_second_line')}</Text>
						</>
					) : (
						<>
							<Text reset>{strings('fiat_on_ramp.purchase_method_title.first_line')}</Text>
							{'\n'}
							<Text reset>{strings('fiat_on_ramp.purchase_method_title.second_line')}</Text>
						</>
					)}
				</Title>
				{WYRE_IS_PROMOTION && (
					<SubHeader centered>{strings('fiat_on_ramp.purchase_method_title.wyre_sub_header')}</SubHeader>
				)}
			</Heading>

			<WyreApplePayPaymentMethod onPress={onPressWyreApplePay} />
			{network === '1' && <TransakPaymentMethod onPress={onPressTransak} />}
		</ScreenView>
	);
}

PaymentMethodSelectorView.propTypes = {
	selectedAddress: PropTypes.string.isRequired,
	network: PropTypes.string.isRequired,
	gasEducationCarouselSeen: PropTypes.bool,
	setGasEducationCarouselSeen: PropTypes.func
};

PaymentMethodSelectorView.navigationOptions = ({ navigation }) => getPaymentSelectorMethodNavbar(navigation);

const mapStateToProps = state => ({
	selectedAddress: state.engine.backgroundState.PreferencesController.selectedAddress,
	network: state.engine.backgroundState.NetworkController.network,
	gasEducationCarouselSeen: state.user.gasEducationCarouselSeen
});

const mapDispatchToProps = dispatch => ({
	setGasEducationCarouselSeen: () => dispatch(setGasEducationCarouselSeen())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PaymentMethodSelectorView);
