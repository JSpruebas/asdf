async function getBnbPrice() {

    const provider = await detectEthereumProvider()
   
    if (provider) {
      // handle provider
    } else {
      alert("No detetada");
    }
  
  }
  
  getBnbPrice();