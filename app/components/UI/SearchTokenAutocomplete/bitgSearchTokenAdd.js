import React, { PureComponent } from 'react';
import { View, StyleSheet, InteractionManager,TextInput ,	ActivityIndicator,} from 'react-native';

import PropTypes from 'prop-types';
import { strings } from '../../../../locales/i18n';
import ActionView from '../ActionView';
import AssetSearch from '../AssetSearch';
import AssetList from '../AssetList';
import BITGAssetList from '../AssetList/bitgAssetList'
import Engine from '../../../core/Engine';
import AnalyticsV2 from '../../../util/analyticsV2';
import axios from 'axios'
import AppConstants from '../../../core/AppConstants'

import { colors, fontStyles } from '../../../styles/common';

import Icon from 'react-native-vector-icons/FontAwesome';
import { toLowerCaseCompare } from '../../../util/general';


const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: colors.white,
		flex: 1
	},
	searchSection: {
		margin: 20,
		marginBottom: 0,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 4,
		borderColor: colors.grey100
	},
	textInput: {
		...fontStyles.normal
	},
	icon: {
		padding: 16
	}
});

/**
 * PureComponent that provides ability to add searched assets with metadata.
 */
export default class BITGSearchTokenAutocomplete extends PureComponent {
	state = {
		searchResults: [],
		searchQuery: '',
		selectedAsset: {},
		assets:[],
		searchQuery: '',
		inputWidth: '85%',
		loading:false
	};

	static propTypes = {
		/**
		/* navigation object required to push new views
		*/
		navigation: PropTypes.object,
		api:PropTypes.object,
	};

	cancelAddToken = () => {
		this.props.navigation.goBack();
	};

	// handleSearch = opts => {
	// 	this.setState({ searchResults: opts.results, searchQuery: opts.searchQuery });
	// };

	handleSearch = searchQuery => {
		this.setState({ searchQuery });
		const {assets} = this.state;
		if(searchQuery.length > 0){
			const addressSearchResult = assets.filter(item => toLowerCaseCompare(item.symbol,searchQuery) || toLowerCaseCompare(item.name,searchQuery))
			this.setState({
				searchResults:addressSearchResult
			})
		}else{
			this.setState({
				searchResults:assets
			})
		}

		// const fuseSearchResult = fuse.search(searchQuery);
		// const addressSearchResult = contractList.filter(token => toLowerCaseCompare(token.address, searchQuery));
		// const results = [...addressSearchResult, ...fuseSearchResult];
		// this.props.onSearch({ searchQuery, results });
	};

	handleSelectAsset = asset => {
		this.setState({ selectedAsset: asset });
	};

	componentDidMount = () => {
		setTimeout(() => this.setState({ inputWidth: '86%' }), 100);
		this.getAnalyticsParams();
		this.getBITGAssetsList() 
	};

	getBITGAssetsList = async () => {
		this.setState({loading:true})
		try {
			const response = await axios.get(`${AppConstants.ASSETS_QUERY_API}`);

			this.setState({loading:false})
	
			if (response?.data) {
				const assets = response.data.assets
				if(assets.length > 0){
					let details = [];

					for(let i = 0;i<assets.length;i++){
						const item = assets[i]
						console.log('item:',item)
						if(item.assetid !=='0'){
							// const tokenInfo = await this.props.api.query.assets.asset(item.assetid);
							const metaInfo = await this.props.api.query.assets.metadata(item.assetid);

							details.push({
								logo: '', 
								address: item.assetid,
								name:this.hex2a(metaInfo.name),
								symbol:this.hex2a(metaInfo.symbol),
								decimals:metaInfo.decimals,
								deposit:metaInfo.deposit,
								...item
							})
						}
						this.setState({assets:details,searchResults:details})
					}
				}
				
			} else {
				console.log('query empty response:');
			}
		} catch (error) {
			this.setState({loading:false})
		}
	}

	hex2a = (hexx) => {
		var hex = hexx.toString();//force conversion
		var str = '';
		for (var i = 2; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}
	

	getAnalyticsParams = () => {
		try {
			const { NetworkController } = Engine.context;
			const { chainId, type } = NetworkController?.state?.provider || {};
			const { address, symbol } = this.state.selectedAsset || {};
			return {
				token_address: address,
				token_symbol: symbol,
				network_name: type,
				chain_id: chainId,
				source: 'Add token dropdown'
			};
		} catch (error) {
			return {};
		}
	};

	addToken = async () => {
		const { AssetsController } = Engine.context;
		const { address, symbol, decimals,assetid } = this.state.selectedAsset;
		console.log('addBITG Token:',this.state.selectedAsset)
		await AssetsController.addBITGToken('', symbol, decimals,'',assetid);

		AnalyticsV2.trackEvent(AnalyticsV2.ANALYTICS_EVENTS.TOKEN_ADDED, this.getAnalyticsParams());

		// Clear state before closing
		this.setState(
			{
				searchResults: this.state.assets,
				searchQuery: '',
				selectedAsset: {}
			},
			() => {
				InteractionManager.runAfterInteractions(() => {
					this.props.navigation.goBack();
				});
			}
		);
	};

	render = () => {
		const { searchResults, selectedAsset, searchQuery ,assets,loading} = this.state;
		const { address, symbol, decimals } = selectedAsset;

		const { inputWidth } = this.state;

		return (
			<View style={styles.wrapper} testID={'search-token-screen'}>

				{
					loading && (
						<View style={{
							flex: 1,
							position:'absolute',
							top:0,
							left:0,
							width:'100%',
							height:'100%',
							alignItems: 'center',
							justifyContent: 'center',
						}} >
							<ActivityIndicator style={{ alignSelf: 'center' }} size="large" color={colors.tintColor} />
						</View>
					)
				}
				<ActionView
					cancelText={strings('add_asset.tokens.cancel_add_token')}
					confirmText={strings('add_asset.tokens.add_token')}
					onCancelPress={this.cancelAddToken}
					onConfirmPress={this.addToken}
					confirmDisabled={!(address && symbol && decimals)}
				>
					<View>


						<View style={styles.searchSection} testID={'add-searched-token-screen'}>
							<Icon name="search" size={22} style={styles.icon} />
							<TextInput
								style={[styles.textInput, { width: inputWidth }]}
								value={searchQuery}
								placeholder={strings('token.search_tokens_placeholder')}
								placeholderTextColor={colors.grey100}
								onChangeText={this.handleSearch}
								testID={'input-search-asset'}
							/>
						</View>
						<BITGAssetList
						    assets = {assets}
							searchResults={searchResults}
							handleSelectAsset={this.handleSelectAsset}
							selectedAsset={selectedAsset}
							searchQuery={searchQuery}
						/>
					</View>
				</ActionView>
			</View>
		);
	};
}
