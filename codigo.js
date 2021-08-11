
const web3 = new Web3;
let chainId;

window.onload = async () => {
  const provider = await detectEthereumProvider({ timeout: 2000 })
  if (provider) {
    provider.on('chainChanged', () => location.reload())
    provider.on('accountsChanged', () => location.reload())
    provider.on('disconnect', () => location.reload())

    await provider.request({ method: 'eth_requestAccounts' })

    web3.setProvider(provider)

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

    document.getElementById("red").innerText = chainId;


    coso();

  } else {
    console.error('Web3 provider not detected')
    alert("No se detecta Meta")
  }
}

const coso = async () => {

  let tuCuenta = await web3.eth.getAccounts();
  document.getElementById("add").innerText = tuCuenta;
  try {
    let tuBalance = await web3.eth.getBalance(tuCuenta[0]);
    tuBalance = web3.utils.fromWei(tuBalance);
    document.getElementById("bal").innerText = tuBalance;
  } catch (err) { console.error(err) }


  if (chainId == 56) {

    const zeroStratContract = await new web3.eth.Contract(window.abi1, "0xaafAb69eC1984c43dE9720F20743033B04E09aFA");
    let pendingReward = await zeroStratContract.methods.calculateTotalPendingCakeRewards().call();

    pendingReward = web3.utils.fromWei(pendingReward);

    document.getElementById("pendRew").innerText = pendingReward;


    let lastHarvest = await zeroStratContract.methods.lastHarvestedTime().call();
    let horaHarvest = lastHarvest * 1000;
    horaHarvest = new Date(horaHarvest);
    document.getElementById("lastHarvest").innerText = horaHarvest;

    let hora = Date.now()
    let tiempo = hora - lastHarvest * 1000
    tiempo = (((tiempo / 3600000)).toFixed(1))
    document.getElementById("horas").innerText = tiempo + " horas";
  }


  const mint = async () => {

    const tokenContract = await new web3.eth.Contract(window.tokenAbi, "0x53D10d081ebB9dAe97095B6c7eee28085c545471");
    let mintTok = await tokenContract.methods.mint(tuCuenta[0], String(100e18)).call();

  }

  document.getElementById("button1").onclick = mint;

}





