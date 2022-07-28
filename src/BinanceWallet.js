import React from 'react'
import { useState } from 'react';

const BinanceWallet = () => {
    const [isConnected, setIsConnected] = useState("Connect Wallet");
    const [walletAddress, setWalletAddress] = useState("");
    const [accountId, setAccountId] = useState("");
    const [walletBalance, setWalletBalance] = useState("");

    const { BinanceChain } = window;
    
    let address;
    
    // let currentChainId = BinanceChain.chainId;
    // console.log("currentChainId>>>>",currentChainId);

    // BinanceChain.on('chainChanged', handleChainChanged);

    // function handleChainChanged(_chainId) {
    //     window.location.reload();
    // }

    const connectWallet = async() => {
        await BinanceChain
        .request({ method: 'eth_requestAccounts' }).then(
            (res) => {
                console.log(res)
                setWalletAddress(res[0])
                address = res[0]
                setIsConnected("Wallet Connected")
            })
     
           console.log( BinanceChain.isConnected());
           console.log( BinanceChain);


           await BinanceChain.requestAccounts().then((res) => {
            console.log("llllllllllll",res[0])
            setAccountId(res[0].id)
        })

        console.log(address,"ssssssssssssss")

       await BinanceChain.request({
            method:'eth_getBalance', params: [address, 'latest'] }).then(
                (res) => {
                    console.log(" Wallet Balance",res/10**18)
                    setWalletBalance(res/10**18);
                })
    }

    const transferBNB = async(e) => {
        if(isConnected == "Wallet Connected"){

            e.preventDefault();
    
            let transferAmount = e.target.sendAmount.value;
            console.log("transferAmount",transferAmount)
    
            let recieverAddress = e.target.recieverAddress.value;
            
            // await BinanceChain.request({method: 'eth_sendTransaction', params: [ { from: address, to: recieverAddress, value: transferAmount}] }).then((res) => {
            //     console.log(res)
            // })

            console.log(walletAddress,"aaaaaaaaaaaaaaaaaaa")

            await BinanceChain.transfer({
                fromAddress: walletAddress,  
                toAddress: recieverAddress, 
                asset: "BNB", 
                amount: transferAmount, 
                networkId: "bbc-testnet", 
                accountId: accountId}).then((res)=>{console.log(res)})
        } else {
            alert("Please Connect Wallet First")
        }
    }

  return (
    <div>
        <h4>---------------BinanceWallet Connection----------</h4>
        <button onClick={connectWallet}>{isConnected}</button>
        <h4>Wallet Address : {walletAddress}</h4>
        <h4>Wallet Balance : {walletBalance}</h4>
        <br/><br/>

        <form onSubmit={transferBNB}>
			<p> Reciever Address </p>
			<input type='text' id='recieverAddress'/>

			<p> Send Amount </p>
			<input type='text' id='sendAmount' />

			<button type='submit' >Send</button>
            {/* <h4>Hash : {hash}</h4> */}
		</form>
    </div>
  )
}

export default BinanceWallet
