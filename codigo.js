
const web3 = new Web3;

window.onload = async () => {
  const provider = await detectEthereumProvider({ timeout: 2000 })
  if (provider) {
    provider.on('chainChanged', () => location.reload())
    provider.on('accountsChanged', () => location.reload())
    provider.on('disconnect', () => location.reload())

    await provider.request({ method: 'eth_requestAccounts' })

    web3.setProvider(provider)

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

  const zeroStratContract = await new web3.eth.Contract(window.abi1, "0xaafAb69eC1984c43dE9720F20743033B04E09aFA");
  let pendingReward = await zeroStratContract.methods.calculateTotalPendingCakeRewards().call();

  pendingReward = web3.utils.fromWei(pendingReward);

  document.getElementById("pendRew").innerText = pendingReward;


  let lastHarvest = await zeroStratContract.methods.lastHarvestedTime().call();
  document.getElementById("lastHarvest").innerText = lastHarvest;
}




