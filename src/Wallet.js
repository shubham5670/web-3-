import React from 'react';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import TokenAbi from "./ABI/Token_Abi.json";
import TokenAbi1 from "./ABI/Token_Abi1.json";

const Wallet = () => {
    let web3;
    const { ethereum } = window
    web3 = new Web3(ethereum)
    
    const address = "0xdb126a7CF1a62F76A66AD3EA13bfc6EEDaA4576F";
    const TokenAddress1 = "0x995765e120676263764aB14781Abe228a7EDd015";
    const TokenAddress2 = "0xB8B1fF9d62eb8dcbB98bC7B8D006b8f5F873f5a3";

    const [showAddress, setAddress] = useState(null);
    const [showBalance, setBalance] = useState(null);
	const [tokenName, setTokenName] = useState("Token");
    const [tokenBalance, setTokenBalance] = useState(null);
	const [contract, setContract] = useState(null);
    const [option, setOption] = useState("");
    const [hash, setHash] = useState(null);

    
    const connectMetamask = async () => {
        console.log("web3",web3);
        console.log(window.ethereum.networkVersion,ethereum.selectedAddress, 'window.ethereum.networkVersion');
        
        const accounts = await ethereum.request({
            method: "eth_requestAccounts"
        })
        console.log("accounts",accounts);
        setAddress(accounts)
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

        }
    }

  return (
    <div>
        <h1>WEB3</h1>
        <button onClick ={connectMetamask}>connect</button>
        <h4>Wallet Address : {showAddress}</h4>
        <h4>Balance: {showBalance}</h4>
		<h4> {tokenName + " Balance"}: {tokenBalance} </h4>
        <select 
        name="Choose"
        onChange={(e)=>setOption(e.target.value)}>
            <option value="">select</option>
            <option value="Token">Token</option>
            <option value="Ethereum">Ethereum</option>

        </select>
            <form onSubmit={transferEthToken}>
					<h1> Transfer {option} </h1>
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