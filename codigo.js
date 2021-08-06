import Web3 from "web3"
   
  const getWeb3 = async () => {
    const provider = await detectEthereumProvider({timeout: 10000})
    if (provider) {
      provider.on('chainChanged', () => location.reload())
      provider.on('networkChanged', () => location.reload())
      provider.on('accountsChanged', () => location.reload())
      provider.on('disconnect', () => location.reload())
  
      await provider.request({ method: 'eth_requestAccounts' })


      web3 = new Web3(provider)

     
  
      const result = {
        injectedWeb3: true,
        provider,
        web3 () {
          return web3
        }
      }
      result.networkId = await web3.eth.net.getId()
      result.coinbase = await web3.eth.getCoinbase()
      result.balance = await web3.eth.getBalance(result.coinbase)
      LocalStorage.set('account-connected', 'true')
      return result
    } 
    console.error('Web3 provider not detected')
    return {injectedWeb3: false}
  }

  getWeb3();

  const coso = async () => {

    const resultado = await web3.eth.getBalance(0x79e858dFAB69949F54D22b3cCCBC04499bF68532)

}

  coso();


  var zeroStratContract = new web3.eth.Contract(zeroStratAbi, "0xaafAb69eC1984c43dE9720F20743033B04E09aFA");
  zeroStratContract.methods.calculateTotalPendingCakeRewards().call().then(console.log);