const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const ContractABI = require("../config/Ticket.json");
const config = require("../config")

const provider = new HDWalletProvider({
    privateKeys: [config.CONTRACT_PRIVATE_KEY],
    providerOrUrl: config.PROVIDER_URL
})

const web3 = new Web3(provider);

const contract = new web3.eth.Contract(ContractABI.abi,config.CONTRACT_ADDRESS);

exports.isValidAddress = (address) => {
    return web3.utils.isAddress(address);
}

module.exports = contract;