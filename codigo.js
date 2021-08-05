async function getBnbPrice() {

    const provider = await detectEthereumProvider()
   
    if (provider) {
        alert("Detectada");
    } else {
      alert("No detetada");
    }
  
  }
  
  getBnbPrice();