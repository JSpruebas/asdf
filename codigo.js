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

    

    const cuenta = web3.eth.requestAccounts().then(console.log);

    const a = web3.eth.getBalance(cuenta).then(console.log);


    return {injectedWeb3: false}

  }

  getWeb3();

  const coso = async () => {

    const cuenta = web3.eth.requestAccounts().then(console.log);

    const a = web3.eth.getBalance(cuenta).then(console.log);

    alert(cuenta, a);

  }