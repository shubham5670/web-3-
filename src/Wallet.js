import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Web3 from 'web3';
import TokenAbi from "./ABI/Token_Abi.json";
import TokenAbi1 from "./ABI/Token_Abi1.json";

const Wallet = () => {
    let web3;
    const { ethereum } = window
    web3 = new Web3(ethereum)
    
    const address = "0x765ae9DdF72b5614Db50E6DEd2c4706114141f4d";
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
    const [recipientAddresss, setRecipientAddress] = useState("");


    const connectMetamask = async () => {
        console.log("web3",web3);
        console.log(window.ethereum.chainId,ethereum.selectedAddress, 'window.ethereum.networkVersion');
        
        // if(metaMaskNetwork===""){
        //     alert("choose network")
        //     return
        // }

        if(window.ethereum.networkVersion===1)
        {
         setNetwork("Mainnet")
        }
        else if(window.ethereum.networkVersion===3)
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
        setAddress(accounts[0])
        console.log('What chain: ', window.ethereum.chainId);
        console.log(showAddress,"qqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

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
                    await web3.eth.sendTransaction({from: showAddress, to: recieverAddress, value: transferAmount}).then((res)=>{
                        console.log(res,"res");
                        setHash(res.blockHash)
                      })
            } catch (error) {
                console.log(error)
            }
        }else if(option==="Token"){
            try {
                console.log("asdfgh",typeof(transferAmount),recieverAddress)
                    await contract1.methods.transfer(recieverAddress,tranfer_amt).send({from: showAddress}).then((r)=>{
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

    const transferFrom = async(e) => {
        if(buttonConnection === "Wallet Connected"){

            console.log("HIT");
            e.preventDefault(); //prevent page reloading

            let contract1 = new web3.eth.Contract(TokenAbi1,TokenAddress2);
            let senderaddress = e.target.senderAdd.value;
            let recipientAddress = e.target.recipientAddress.value;
            let amount = e.target.amount.value*10**18;
            let amt = amount.toString();
            console.log(showAddress,"aaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            try {
                console.log("TRY");
                await contract1.methods.transferFrom(senderaddress,recipientAddress,amt).send({from: showAddress}).then((r)=>{
                    console.log("res",r)
                    setHash(r.blockHash);
                })
            } catch(err){
                console.log(err)
            }
        } else {
            alert("Please connect Wallet First")
        }
    }

    const approveTransc = async(e) => {
        if(buttonConnection === "Wallet Connected"){

            e.preventDefault(); //prevent page reloading
    
            let contract1 = new web3.eth.Contract(TokenAbi1,TokenAddress2);
        
            let recipientAddress = e.target.recipientAddress.value;
            setRecipientAddress(recipientAddress);
            let amount = e.target.amount.value*10**18;
            let amt = amount.toString();
            try {
                await contract1.methods.approve(recipientAddress,amt).send({
                    from: showAddress
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Please Connect wallet First.")
        }
    }

console.log(showAddress,"qqqqqqqqqqqqqqqqqq");

  return (
    <div>
        <h1>WEB3 Integration</h1>
        {/* <select 
        name="Choose"
        onChange={(e)=>setMetaMaskNetwork(e.target.value)}>
            <option value="">select</option>
            <option value="Mainnet">Mainnet</option>
            <option value="Testnet">Testnet</option>

        </select><br/><br/> */}
        <button onClick ={connectMetamask}>{buttonConnection}</button><br/><br/>
        {buttonConnection === "Wallet Connected" ?
        network === "Ropsten testnet" || network === "Mainnet"  ? network : <button onClick={changeNetwork}>{errorr}</button> 
        :""}
        <h4>Wallet Address : {showAddress}</h4>
        <h4>Balance: {showBalance}</h4>
		<h4> {tokenName + " Balance"}: {tokenBalance} </h4>
        <br/><br/>

        {/* Approve Section */}
        <form onSubmit={approveTransc}>
            <h4>Allow Recipient address to transact on my behalf </h4>
            <label>Enter the Recipient Address: </label>
            <input type="text" id='recipientAddress' placeholder='Enter Address'></input><br/><br/>
            <label>Enter Amount: </label>
            <input type="number" id="amount" placeholder='Enter Amount'></input><br/><br/>
            <button type='submit'>Approve</button>
        </form>
        <br/><br/>

        {/* TransferFrom Section */}
        <form onSubmit={transferFrom}>
            <h3>Transfer From Functionality</h3>
            <label>Enter sender Address: </label>
            <input type="text" id="senderAdd" placeholder='Sender Address' /><br/><br/>
            <label>Enter the Recipient Address: </label>
            <input type="text" id='recipientAddress' placeholder='Recipient Address'></input><br/><br/>
            <label>Enter Amount: </label>
            <input type="number" id="amount" placeholder='Enter Amount'></input><br/><br/>
            <button type='submit'>Transfer</button>
        </form>
        <br/><br/>

        {/* Simple transfer section */}
        <h3>Simple Transfer (ETH/Token)</h3>
        <h1> {option}</h1>
        <select 
        name="Choose"
        onChange={(e)=>setOption(e.target.value)}>
            <option value="">select</option>
            <option value="Token">Token</option>
            <option value="Ethereum">Ethereum</option>
        </select><br/><br/>

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
export default Wallet