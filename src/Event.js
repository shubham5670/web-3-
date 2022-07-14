import React from 'react'

const Event = () => {
  let web3;
    const { ethereum } = window
    web3 = new Web3(ethereum)
    
    const address = "0xdb126a7CF1a62F76A66AD3EA13bfc6EEDaA4576F";
    const TokenAddress1 = "0x995765e120676263764aB14781Abe228a7EDd015";
    const TokenAddress2 = "0xB8B1fF9d62eb8dcbB98bC7B8D006b8f5F873f5a3";

    const [showAddress, setAddress] = useState(null);
    const [showBalance, setBalance] = useState(null);
    const [buttonConnection, setButtonConnection] = useState("Connect");
	  const [tokenName, setTokenName] = useState("Token");
    const [tokenBalance, setTokenBalance] = useState(null);
	  const [contract, setContract] = useState(null);
    const [option, setOption] = useState("");
    const [hash, setHash] = useState(null);
    const [network, setNetwork] = useState("");
    const [metaMaskNetwork, setMetaMaskNetwork] = useState("");
    const [errorr, setErrorr] = useState();


    const connectMetamask = async () => {
        console.log("web3",web3);
        console.log(window.ethereum.chainId,ethereum.selectedAddress, 'window.ethereum.networkVersion');
        
        if(metaMaskNetwork===""){
            alert("choose network")
            return
        }

        if(window.ethereum.networkVersion==1)
        {
         setNetwork("Mainnet")
        }
        else if(window.ethereum.networkVersion==3)
        {
            setNetwork("Ropsten")
        }
        
        const accounts = await ethereum.request({
            method: "eth_requestAccounts"
        })
        if(ethereum.chainId === "0x1" ){
            await window.ethereum.request({ 
                method: 'wallet_switchEthereumChain', 
                params: [{ chainId: '0x1' }],
            });
            setTokenName("Token");
            setTokenBalance(0);
            setNetwork("Mainnet")
            
        }else if(ethereum.chainId === "0x3" ){
            await window.ethereum.request({ 
                method: 'wallet_switchEthereumChain', 
                params: [{ chainId: '0x3' }],
            });
            setNetwork("Ropsten testnet")
        }else {
            setErrorr("Switch Network");
            setNetwork(ethereum.chainId);
            setTokenBalance(0);
        }

        setButtonConnection("Wallet Connected");
        console.log("accounts",accounts);
        setAddress(accounts)
        
        console.log('What chain: ', window.ethereum.chainId);
    

        const balance = await web3.eth.getBalance(accounts[0]);
        console.log("balance",balance/10**18);
        const balancee = balance/10**18;
        setBalance(balancee);
        // Get ERC20 Token contract instance
        let contract = new web3.eth.Contract(TokenAbi,TokenAddress1);
        console.log("contract",contract);
        setContract(contract);

        let contract1 = new web3.eth.Contract(TokenAbi1,TokenAddress2);
        console.log("aaaaaaaaaaaaaaaaaa",await contract1.methods.name().call())

        const tName = await contract1.methods.name().call().then((result) => {
            console.log("result",result);
            setTokenName(result)
        })
        const token_balance =await contract1.methods.balanceOf(accounts[0]).call().then((result) => {
            console.log("result",result);
            setTokenBalance(result/10**18)
        })
    }

    useEffect(() => {
        window.ethereum.on("chainChanged", () => {

            if(buttonConnection=== "Wallet Connected"){
                connectMetamask();
            }
        })
    })


    const changeNetwork = async() => {
        await window.ethereum.request({ 
                method: 'wallet_switchEthereumChain', 
                params: [{ chainId: '0x1' }],
            });
            setTokenName("Token");
            setTokenBalance(0);
    }

    const transferEthToken = async(e) => {
        console.log("hit");
        e.preventDefault(); //prevent page reloading
        // Get ERC20 Token contract instance
        let contract = new web3.eth.Contract(TokenAbi,TokenAddress2);
        
        let contract1 = new web3.eth.Contract(TokenAbi1,TokenAddress2);

		let transferAmount = e.target.sendAmount.value*10**18;
        let tranfer_amt = transferAmount.toString()

		let recieverAddress = e.target.recieverAddress.value;

        console.log("transferAmount:",transferAmount)
      
        console.log("contqwertyuiract",contract);

        if(option==="Ethereum"){
            try {
                    await web3.eth.sendTransaction({from: address, to: recieverAddress, value: transferAmount}).then((res)=>{
                        console.log(res,"res");
                        setHash(res.blockHash)
                      })
            } catch (error) {
                console.log(error)
            }
        }else if(option==="Token"){
            try {
                console.log("asdfgh",typeof(transferAmount),recieverAddress)
                    await contract1.methods.transfer(recieverAddress,tranfer_amt).send({from: address}).then((r)=>{
                        console.log("res",r)
                        setHash(r.blockHash);
                    })
            } catch (error) {
                console.log(error);
            }
        }else {
            alert("Choose correct option (Either you can send Token or Ethereum)")
        }
    }

console.log(network,"qqqqqqqqqqqqqqqqqq");
  return (
    <div>
        <h1>WEB3 Integration</h1>
        <select 
        name="Choose"
        onChange={(e)=>setMetaMaskNetwork(e.target.value)}>
            <option value="">select</option>
            <option value="Mainnet">Mainnet</option>
            <option value="Testnet">Testnet</option>

        </select><br/><br/>
        <button onClick ={connectMetamask}>{buttonConnection}</button><br/><br/>
        {buttonConnection === "Wallet Connected" ?
        network === "Ropsten testnet" || network === "Mainnet"  ? network : <button onClick={changeNetwork}>{errorr}</button> 
        :""}
        <h4>Wallet Address : {showAddress}</h4>
        <h4>Balance: {showBalance}</h4>
		<h4> {tokenName + " Balance"}: {tokenBalance} </h4>
        <h1>Transfer {option}</h1>
        <select 
        name="Choose"
        onChange={(e)=>setOption(e.target.value)}>
            <option value="">select</option>
            <option value="Token">Token</option>
            <option value="Ethereum">Ethereum</option>

        </select>
            <form onSubmit={transferEthToken}>
						<p> Reciever Address </p>
						<input type='text' id='recieverAddress'/>

						<p> Send Amount </p>
						<input type='number' id='sendAmount' />

						<button type='submit' >Send</button>
                        <h4>Hash : {hash}</h4>
			</form>
    </div>
  )

}

export default Event