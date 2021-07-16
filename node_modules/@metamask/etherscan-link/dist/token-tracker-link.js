"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenTrackerLinkForChain = exports.createCustomTokenTrackerLink = exports.createTokenTrackerLink = void 0;
const helpers_1 = require("./helpers");
const prefix_for_chain_1 = __importDefault(require("./prefix-for-chain"));
const prefix_for_network_1 = __importDefault(require("./prefix-for-network"));
function createTokenTrackerLink(tokenAddress, network, holderAddress) {
    const prefix = prefix_for_network_1.default(network);
    return prefix === null ? '' :
        `https://${prefix}etherscan.io/token/${tokenAddress}${holderAddress ? `?a=${holderAddress}` : ''}`;
}
exports.createTokenTrackerLink = createTokenTrackerLink;
function createCustomTokenTrackerLink(tokenAddress, customNetworkUrl) {
    const parsedUrl = helpers_1.addPathToUrl(customNetworkUrl, 'token', tokenAddress);
    return parsedUrl;
}
exports.createCustomTokenTrackerLink = createCustomTokenTrackerLink;
function createTokenTrackerLinkForChain(tokenAddress, chainId, holderAddress) {
    const prefix = prefix_for_chain_1.default(chainId);
    return prefix === null ? '' :
        `https://${prefix}etherscan.io/token/${tokenAddress}${holderAddress ? `?a=${holderAddress}` : ''}`;
}
exports.createTokenTrackerLinkForChain = createTokenTrackerLinkForChain;
//# sourceMappingURL=token-tracker-link.js.map