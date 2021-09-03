import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { colors, fontStyles } from '../../../styles/common';
import { connect } from 'react-redux';
import DefaultTabBar from 'react-native-scrollable-tab-view/DefaultTabBar';
import AddCustomToken from '../../UI/AddCustomToken';
import SearchTokenAutocomplete from '../../UI/SearchTokenAutocomplete';
import BITGSearchTokenAutocomplete from '../../UI/SearchTokenAutocomplete/bitgSearchTokenAdd'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PropTypes from 'prop-types';
import { strings } from '../../../../locales/i18n';
import AddCustomCollectible from '../../UI/AddCustomCollectible';
import { getNetworkNavbarOptions,getBITGNetworkNavbarOptions,getBITGWalletNavbarOptions } from '../../UI/Navbar';
import { NetworksChainId } from '@metamask/controllers';

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: colors.white
	},
	tabUnderlineStyle: {
		height: 2,
		backgroundColor: colors.green
	},
	tabStyle: {
		paddingBottom: 0
	},
	textStyle: {
		fontSize: 16,
		letterSpacing: 0.5,
		...fontStyles.bold
	}
});

/**
 * PureComponent that provides ability to add assets.
 */
class BITGAddAsset extends PureComponent {
	static navigationOptions = ({ navigation }) =>
	getBITGNetworkNavbarOptions(
			`add_asset.${navigation.state.params.assetType === 'token' ? 'title' : 'title_nft'}`,
			true,
			navigation
		);

	state = {
		address: '',
		symbol: '',
		decimals: ''
	};

	static propTypes = {
		/**
		/* navigation object required to push new views
		*/
		navigation: PropTypes.object,
		/**
		 * Chain id
		 */
		chainId: PropTypes.string,
		
		api:PropTypes.object
	};

	async componentDidMount(){

	}

	renderTabBar() {
		return (
			<DefaultTabBar
				underlineStyle={styles.tabUnderlineStyle}
				activeTextColor={colors.green}
				inactiveTextColor={colors.fontTertiary}
				backgroundColor={colors.white}
				tabStyle={styles.tabStyle}
				textStyle={styles.textStyle}
			/>
		);
	}

	render = () => {
		const {
			navigation: {
				state: {
					params: { assetType, collectibleContract }
				}
			},
			navigation
		} = this.props;
		return (
			<SafeAreaView style={styles.wrapper} testID={`add-${assetType}-screen`}>
				{assetType === 'token' ? (
					<BITGSearchTokenAutocomplete
						navigation={navigation}
						tabLabel={strings('add_asset.search_token')}
						testID={'tab-search-token'}
						api={this.props.api}
					/>
				) : (
					<AddCustomCollectible
						navigation={navigation}
						collectibleContract={collectibleContract}
						testID={'add-custom-collectible'}
					/>
				)}
			</SafeAreaView>
		);
	};
}

const mapStateToProps = state => ({
	chainId: state.engine.backgroundState.NetworkController.provider.chainId,
	api: state.polka.api
});

export default connect(mapStateToProps)(BITGAddAsset);
