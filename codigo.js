
const web3 = new Web3;

const getWeb3 = async () => {
  const provider = await detectEthereumProvider({ timeout: 10000 })
  if (provider) {
    provider.on('chainChanged', () => location.reload())
    provider.on('accountsChanged', () => location.reload())
    provider.on('disconnect', () => location.reload())

    await provider.request({ method: 'eth_requestAccounts' })

    web3.setProvider(provider)
    // web3.eth.setProvider(provider)

    //web3 = new Web3(provider)     


    const result = {
      injectedWeb3: true,
      provider,
      web3() {
        return web3
      }
    }
    result.networkId = await web3.eth.net.getId()
    result.coinbase = await web3.eth.getCoinbase()
    result.balance = await web3.eth.getBalance(result.coinbase)



    coso();



    return result
  }
  console.error('Web3 provider not detected')
  alert("No se detecta Meta")
  return { injectedWeb3: false }
}

getWeb3();

const coso = async () => {
  // const cuenta = "0x79e858dFAB69949F54D22b3cCCBC04499bF68532"

  // const resultado = await web3.eth.getBalance(cuenta)
  // alert("El balance de " + cuenta + " es: " + resultado)

  let tuCuenta = await web3.eth.getAccounts();
  //document.write("Tu cuenta conectada: " + tuCuenta + "</p>");

  const zeroStratContract = await new web3.eth.Contract(window.abi1, "0xaafAb69eC1984c43dE9720F20743033B04E09aFA");
  let pendingReward = await zeroStratContract.methods.calculateTotalPendingCakeRewards().call();


  pendingReward = web3.utils.fromWei(pendingReward);

  document.getElementById("pendingRew").innerText = "hola";

  document.write("Pending reward (busd/ust): " + pendingReward);
}




