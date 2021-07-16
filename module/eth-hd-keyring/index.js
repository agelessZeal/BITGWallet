const { hdkey } = require('ethereumjs-wallet')
const SimpleKeyring = require('eth-simple-keyring')
const bip39 = require('bip39')
const sigUtil = require('eth-sig-util')

// Options:
const hdPathString = `m/44'/60'/0'/0`
const type = 'HD Key Tree'


const { Keyring } =  require('@polkadot/keyring');

// imports we are using here
const { u8aToHex } = require('@polkadot/util');
const { mnemonicGenerate, mnemonicToMiniSecret, randomAsHex } = require('@polkadot/util-crypto');


class HdKeyring extends SimpleKeyring {

  /* PUBLIC METHODS */
  constructor (opts = {}) {
    super()
    this.type = type
    this.deserialize(opts)
    this.polkaKeyring = new Keyring();  
    console.log('opts:',opts) 
  }

  serialize () {
    return Promise.resolve({
      mnemonic: this.mnemonic,
      numberOfAccounts: this.wallets.length,
      hdPath: this.hdPath,
    })
  }

  deserialize (opts = {}) {
    this.opts = opts || {}
    this.wallets = []
    this.mnemonic = null
    this.root = null
    this.hdPath = opts.hdPath || hdPathString

    if (opts.mnemonic) {
      this._initFromMnemonic(opts.mnemonic)
    }

    if (opts.numberOfAccounts) {
      return this.addAccounts(opts.numberOfAccounts)
    }

    return Promise.resolve([])
  }

  addAccounts (numberOfAccounts = 1) {
    if (!this.root) {
      this._initFromMnemonic(bip39.generateMnemonic())
    }

    if(!this.polkaKeyring){
      this.polkaKeyring = new Keyring();  
    }

    const oldLen = this.wallets.length
    const newWallets = []
    for (let i = oldLen; i < numberOfAccounts + oldLen; i++) {
      const child = this.root.deriveChild(i)
      const wallet = child.getWallet()
      newWallets.push(wallet)
      this.wallets.push(wallet)
      console.log('hd addAccounts index:',i,this.mnemonic,this.polkaKeyring)

      if(this.polkaKeyring){
       this.polkaKeyring.addFromUri(`${this.mnemonic}//BITG//agelessZeal//p${i}`);
       console.log('hd add new polka address in addAccounts')
      }
    }

    const hexWallets = newWallets.map((w) => {
      return sigUtil.normalize(w.getAddress().toString('hex'))
    })
    return Promise.resolve(hexWallets)
  }

  getAccounts () {
    console.log(this.polkaKeyring?.pairs.length,' hd getAccounts')
    console.log('getAccounts hd:',this.wallets.length)

    console.log('getAccount:',this.mnemonic,this.polkaKeyring)

    if(!this.polkaKeyring){
      this.polkaKeyring = new Keyring(); 
      this.polkaKeyring.addFromUri(`${this.mnemonic}//BITG//agelessZeal//p0`);
      console.log('polka keyring add new since null')

    }

    if(this.polkaKeyring?.pairs.length === 0){
      console.log('polka keyring add new since empty')
      this.polkaKeyring.addFromUri(`${this.mnemonic}//BITG//agelessZeal//p0`);
    }

    if(this.polkaKeyring?.pairs.length === 0){
     return Promise.resolve(this.wallets.map((w) => {
        return sigUtil.normalize(w.getAddress().toString('hex'))
      }))
     }

    return Promise.resolve(this.polkaKeyring?.pairs.map((pair) => {
      return pair.address;
      // some sr25519 pairs
		  // console.log('keyring:sr25519:')
		  // console.log(keyring.createFromUri(MNEMONIC, {}, { type: 'sr25519' }).address);
      // const pair = this.polkaKeyring.createFromUri(`${this.mnemonic}//BITG//soft//${index}`, {});
      // console.log('hd kerying getAccounts sr25519 address:',pair.address)
      // return sigUtil.normalize(w.getAddress().toString('hex'))
    }))

    

    // return Promise.resolve(this.wallets.map((w,index) => {
    //   return sigUtil.normalize(w.getAddress().toString('hex'))
    // }))
  }

  /* PRIVATE METHODS */

  _initFromMnemonic (mnemonic) {
    this.mnemonic = mnemonic


    console.log('hd keyring _initFromMnemonic:',mnemonic)
    const seed = bip39.mnemonicToSeed(mnemonic)
    this.hdWallet = hdkey.fromMasterSeed(seed)
    this.root = this.hdWallet.derivePath(this.hdPath)
  }
}

HdKeyring.type = type
module.exports = HdKeyring
