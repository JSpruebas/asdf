const Web3 = require("web3");
const BigNumber = require("bignumber.js");
const Pancake = require("@pancakeswap-libs/sdk");
const EthProviders = require("@ethersproject/providers");
const abi = require("./abi.json");
const ercAbi = require("./ERC20Abi.json");
const strats = require("./strats.json");
const Web3HDWalletProvider = require("web3-hdwallet-provider");

// Setup
const mnemonic = "";
const bscScanApiKey = "QYT22B5WPRVB4ZEFZX6QSEEYSE98N2UZDD";

const rpcUrl = "https://bsc-dataseed1.defibit.io/";

const httpProvider = new Web3.providers.HttpProvider(rpcUrl);
//const provider = new Web3HDWalletProvider(mnemonic, httpProvider);
const web3 = new Web3(provider);
const api = require("bscscan-api").init(bscScanApiKey);





async function evaluateStrat(strat) {
    const data = await api.contract.getabi(strat.farm);
    const farmAbi = JSON.parse(data.result);

    if (farmAbi == "") {
        console.error(strat.id, "Error loading Abi " + strat.farm);
        return -1;
    }

    const farmContract = new web3.eth.Contract(farmAbi, strat.farm);


    const pending = await farmContract.methods[strat.pendingMethod](
    ).call();

    console.log(strat.id, "Pending Farm/Strat", pending.toString(), pendingStratBig.toString());
    console.log(strat.id, "Bounty", bounty.toString());


}

