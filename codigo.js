
const web3 = new Web3;
const bsc = new Web3;
const polygon = new Web3;
const fantom = new Web3;
let chainId;

window.onload = async () => {
  const provider = await detectEthereumProvider({ timeout: 2000 })
  if (provider) {
    provider.on('chainChanged', () => location.reload())
    provider.on('accountsChanged', () => location.reload())
    provider.on('disconnect', () => location.reload())

    await provider.request({ method: 'eth_requestAccounts' })

    web3.setProvider(provider)
    bsc.setProvider("https://bsc-dataseed.binance.org/")
    polygon.setProvider("https://rpc-mainnet.maticvigil.com/")
    fantom.setProvider("https://rpcapi.fantom.network")


    chainId = await web3.eth.getChainId()

    switch (chainId) {
      case 1:
        chainId = 'Ethereum Mainnet'
        break
      case 56:
        chainId = 'Binance Smart Chain'
        break
      case 97:
        chainId = 'Binance Smart Chain (Testnet)'
        break
      case 250:
        chainId = 'Fantom Opera'
        break
      case 137:
        chainId = 'Polygon'
        break
      default:
        chainId = 'Alguna red'
    }

    document.getElementById("red").textContent = chainId;

    coso()
    wbusdStats()

  } else {
    console.error('Web3 provider not detected')
    alert("Metamask no detectado, use navegador dapp")

  }
}


const coso = async () => {

  let tuCuenta = await web3.eth.getAccounts();
  let cuenta = String(tuCuenta).substring(1, 5);
  document.getElementById("add").textContent = cuenta + "...";
  try {
    let tuBalance = await web3.eth.getBalance(tuCuenta[0]);
    tuBalance = Number(web3.utils.fromWei(tuBalance)).toFixed(3);
    document.getElementById("bal").textContent = tuBalance;
  } catch (err) { console.error(err) }


  if (chainId == 'Binance Smart Chain') {


    const zeroStratContract = await new web3.eth.Contract(window.abi1, "0xaafAb69eC1984c43dE9720F20743033B04E09aFA");
    let pendingReward = await zeroStratContract.methods.calculateTotalPendingCakeRewards().call();

    let pendingHumano = web3.utils.fromWei(pendingReward);

    document.getElementById("pendRew").innerText = pendingHumano;


    let lastHarvest = await zeroStratContract.methods.lastHarvestedTime().call();
    let horaHarvest = lastHarvest * 1000;
    horaHarvest = new Date(horaHarvest);
    //document.getElementById("lastHarvest").innerText = horaHarvest;

    let hora = Date.now()
    let tiempo = hora - lastHarvest * 1000
    tiempo = (((tiempo / 3600000)).toFixed(1))
    document.getElementById("horas").innerText = tiempo + " horas";

    document.getElementById("BSC").style.display = "inline-block";

  }



  document.getElementById("button1").onclick = mint;

}



const wbusdStats = async () => {
  const wbusdPolygon = await new polygon.eth.Contract(window.tokenAbi, "0x87ff96aba480f1813aF5c780387d8De7cf7D8261")
  const wbusdFtm = await new fantom.eth.Contract(window.tokenAbi, "0xB49C1609e70D25B945d80989632C24df96353980")

  let balancePoly = await wbusdPolygon.methods.totalSupply().call()
  balancePoly = Number(polygon.utils.fromWei(balancePoly)).toFixed(1);
  balancePoly = new Intl.NumberFormat().format(balancePoly);
  document.getElementById("wbusdPoly").textContent = balancePoly;

  let balanceFtm = await wbusdFtm.methods.totalSupply().call()
  balanceFtm = Number(fantom.utils.fromWei(balanceFtm)).toFixed(1);
  balanceFtm = new Intl.NumberFormat().format(balanceFtm);
  document.getElementById("wbusdFtm").textContent = balanceFtm;

  const busdContract = await new bsc.eth.Contract(window.tokenAbi, "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56")
  const collContract = "0x32e8E9095E05B4203Fe9B23284144f89766e634A"

  let collateral = await busdContract.methods.balanceOf(collContract).call()
  collateral = Number(bsc.utils.fromWei(collateral)).toFixed(1);
  collateral = new Intl.NumberFormat().format(collateral);
  document.getElementById("ColBusd").textContent = collateral;


}

/*

const mint = async () => {

  let cuenta = await web3.eth.getAccounts();

  const tokenContract = await new web3.eth.Contract(window.tokenAbi, "0x38B1Be51a2ee443006f4F8799c23E59De0ED8C6d");
  await tokenContract.methods.mint(cuenta[0], BigInt(1e22)).send({ from: cuenta[0] });

}

*/


let refrescar = setInterval(wbusdStats, 30000);






