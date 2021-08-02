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

const minimalBounty = new BigNumber(0.7);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const busdToken = new Pancake.Token(
  Pancake.ChainId.MAINNET,
  "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  18
);

const httpProvider = new Web3.providers.HttpProvider(rpcUrl);
const provider = new Web3HDWalletProvider(mnemonic, httpProvider);
const web3 = new Web3(provider);
const api = require("bscscan-api").init(bscScanApiKey);

async function getBnbPrice() {
  const pairData = await Pancake.Fetcher.fetchPairData(
    busdToken,
    Pancake.WETH[Pancake.ChainId.MAINNET],
    EthProviders.getDefaultProvider(rpcUrl)
  );

  return new BigNumber(parseFloat(pairData.token1Price.toSignificant()));
}

async function getPrice(address) {
  const token = new Pancake.Token(Pancake.ChainId.MAINNET, address, 18);

  const pairData = await Pancake.Fetcher.fetchPairData(
    token,
    Pancake.WETH[Pancake.ChainId.MAINNET],
    EthProviders.getDefaultProvider(rpcUrl)
  );

  const tokenBnbPrice = new BigNumber(
    parseFloat(pairData.token0Price.toSignificant())
  );

  const bnbBusdPrice = await getBnbPrice();

  return tokenBnbPrice.div(bnbBusdPrice);
}

async function getBalance(strat) {
  const tokenContract = new web3.eth.Contract(ercAbi, strat.token);
  const balanceOf = await tokenContract.methods.balanceOf(strat.address).call();

  return new BigNumber(balanceOf);
}

async function evaluateStrat(strat) {
  const data = await api.contract.getabi(strat.farm);
  const farmAbi = JSON.parse(data.result);

  if (farmAbi == "") {
    console.error(strat.id, "Error loading Abi " + strat.farm);
    return -1;
  }

  const farmContract = new web3.eth.Contract(farmAbi, strat.farm);
  const pending = await farmContract.methods[strat.pendingMethod](
    strat.pid,
    strat.address
  ).call();

  const pendingBig = new BigNumber(pending);
  const pendingStratBig = await getBalance(strat);
  const fee = pendingBig.plus(pendingStratBig).div(1e18).times(0.005);
  const price = await getPrice(strat.token);
  const bounty = fee.times(price);

  console.log(strat.id, "Pending Farm/Strat", pendingBig.toString(), pendingStratBig.toString());
  console.log(strat.id, "Bounty", bounty.toString());

  return bounty.isGreaterThan(minimalBounty);
}

async function harvest(strat, my) {
  try {
    const stratContrat = new web3.eth.Contract(abi, strat.address);
    return await stratContrat.methods.harvest().send({ from: my });
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function goBot() {
  const accounts = await web3.eth.getAccounts();

  while (true) {
    for (var strat of strats) {
      const canHarvest = await evaluateStrat(strat);

      if (canHarvest) {
        console.log("Harvest time");
        const result = await harvest(strat, accounts[0]);

        if (result != null)
          console.log("All good my friend");
      }
    }

    await delay(4000);
  }

  return 0;
}

goBot().then(process.exit);
