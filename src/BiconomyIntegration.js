import React from 'react';
import {Biconomy} from "@biconomy/mexa";
import  Web3  from "web3";
import TokenAbi2 from './ABI/Token_Abi2.json';
import { useState } from 'react';
import ethUtils from 'ethereumjs-util';

const BiconomyIntegration = () => {

    const { ethereum } = window;

    const provider = new Web3.providers.HttpProvider('http://localhost:3000/');

    const biconomy = new Biconomy(window.ethereum, {
      apiKey: 'Yo0MFkUSp.97fbcc2b-e651-4527-9ea0-c3e1d2287f81',
      debug: true,
      contractAddresses: ['0x9d7E73478800631a417E05cDe3d74D86CaC117F0' ],
    });

    const [showAddress, setAddress] = useState(null);
    const [buttonConnection, setButtonConnection] = useState("Connect");
    const [showBalance, setBalance] = useState(null);
	  const [tokenName, setTokenName] = useState("Token");
    const [tokenBalance, setTokenBalance] = useState(null);
    const [transactionHash, setTransactionHash] = useState('');

    const TokenAddress2 = '0x9d7E73478800631a417E05cDe3d74D86CaC117F0';
    const userAddress = '0xdb126a7CF1a62F76A66AD3EA13bfc6EEDaA4576F'
    const contractAddress = '0x9d7E73478800631a417E05cDe3d74D86CaC117F0';
    const privateKey = '30f6f8e9d63ca92a75b34c868c5022a2c935bec2110efa4112057aad5f70dc48'

    // This web3 instance is used to read normally and write to contract via meta transactions.
    const web3 = new Web3(biconomy.provider);

    const contract = new web3.eth.Contract(TokenAbi2, TokenAddress2);

    let functionSignature = contract.methods.transfer('0x765ae9DdF72b5614Db50E6DEd2c4706114141f4d', 20).encodeABI();
    console.log("functionSignature",functionSignature)

    const constructMetaTransactionMessage = (nonce, chainId, functionSignature, contractAddress) => {
      return TokenAbi2(
          // ["uint256", "address", "uint256", "bytes"],
          [nonce, contractAddress, chainId, ethUtils.toBuffer(functionSignature)]
      )
    }
    const getSignatureParameters = signature => {
      if (!web3.utils.isHexStrict(signature)) {
          throw new Error(
              'Given value "'.concat(signature, '" is not a valid hex string.')
          );
      }
      var r = signature.slice(0, 66);
      var s = "0x".concat(signature.slice(66, 130));
      var v = "0x".concat(signature.slice(130, 132));
      v = web3.utils.hexToNumber(v);
      if (![27, 28].includes(v)) v += 27;
      return {
          r: r,
          s: s,
          v: v
      };
  };

    const contractInstance = new web3.eth.Contract(
      TokenAbi2,
     '0x9d7E73478800631a417E05cDe3d74D86CaC117F0'
    );
  

    const connectMetamask = async() => {
      console.log("Biconomy:::",biconomy);
      console.log("conttract Instance::::",contractInstance)
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      })

      console.log("Address:::",accounts[0])
      setAddress(accounts[0])
      setButtonConnection("Wallet Connected");
      console.log(window.ethereum.chainId,ethereum.selectedAddress, 'window.ethereum.networkVersion');

      const balance = await web3.eth.getBalance(accounts[0])
      console.log("balance",balance/10**18);
      const balancee = balance/10**18;
      setBalance(balancee);

      let contract1 = new web3.eth.Contract(TokenAbi2,TokenAddress2);
        console.log("contract1",contract1)

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
      e.preventDefault(); 

      // let contract1 = new web3.eth.Contract(TokenAbi2,TokenAddress2);
      const contract = new web3.eth.Contract(TokenAbi2, TokenAddress2);
      let nonce = await contract.methods.getNonce(userAddress).call();
      console.log("Contract in transfer function",contract);
      console.log("NONCE",nonce)

      // let transferAmount = e.target.sendAmount.value*10**18;
      // let tranfer_amt = transferAmount.toString()

      // let recieverAddress = e.target.recieverAddress.value;

      
      
      let chainId = 97;
      
        //same helper constructMetaTransactionMessage used in SDK front-end code
        let messageToSign = constructMetaTransactionMessage(nonce, chainId, functionSignature, contractAddress);
        console.log("messageToSign",messageToSign)
        let { signature } = web3.eth.accounts.sign("0x" + messageToSign.toString("hex"), `0x${privateKey}`);
        let { r, s, v } = getSignatureParameters(signature); // same helper used in SDK frontend code

        let estimatedGas = await contract.methods.executeMetaTransaction(userAddress, functionSignature, r, s, v).estimateGas({ from: userAddress });
        console.log('estimatedGas---->>>>>', estimatedGas)

        let executeMetaTransactionData = contract.methods.executeMetaTransaction(userAddress, functionSignature, r, s, v).encodeABI();

        web3.eth.getGasPrice().then(console.log)
        let txParams = {
            "from": userAddress,
            "to": contractAddress,
            "value": "0x0",
            "gas": "10000000", // (optional) your custom gas limit
            "data": executeMetaTransactionData
        };
        const signedTx = await web3.eth.accounts.signTransaction(txParams, `0x${privateKey}`);
        console.log('=================signed===================')
        console.log(signedTx)
        try {
            console.log('adsfsadfsafdsadfsafd')

            let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, txHash) => {
                if (error) {
                    // return console.error(error);
                    console.log('=================error===================')
                    console.log(error)
                }
                console.log("Transaction hash is ", txHash);
                // do something with transaction hash
            });

            console.log(receipt.transactionHash);
            console.log('=================completed===================')

        } catch (error) {
            console.log('error aa gayi =========')
            console.log(error)
        }
          // try {
          //   //  await contract1.methods.transfer(recieverAddress,tranfer_amt).send({from: showAddress}).then((res) => {
          //   //    console.log('response',res)
          //   //  })
          //   console.log("jjjjjjjjjjjj",contractInstance.methods);
          //   await contractInstance.methods.executeMetaTransaction( showAddress, recieverAddress, tranfer_amt).then((res)=>{
          //         console.log(res,"res");
          //         setTransactionHash(res.blockHash)
          //       })
          // } catch (error) {
          //     console.log(error)
          // }    
  }

  return (
    <div>
        <h4>Biconomy Integration</h4>
        <button onClick={connectMetamask}>{buttonConnection}</button>
        <h4>Address : {showAddress}</h4>
        <h4>Balance : {showBalance}</h4>
        <h4>Token Name : {tokenName}</h4>
        <h4>Token Balance : {tokenBalance}</h4>

<br/><br/>

        <form onSubmit={transferEthToken}>
			{/* <p> Reciever Address </p>
			<input type='text' id='recieverAddress'/>

			<p> Send Amount </p>
			<input type='text' id='sendAmount' /> */}

			<button type='submit' >Send</button>
		</form>
      <p>{transactionHash}</p>

    </div>
  )
}

export default BiconomyIntegration