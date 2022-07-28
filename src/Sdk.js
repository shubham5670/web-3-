import React from "react";
import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";
import Token_Abi2 from "./ABI/Token_Abi2.json";
import { useState } from "react";
import sigUtil from "eth-sig-util";
import { utils } from "ethers";
import sha3 from "solidity-sha3";
import { toBuffer } from "ethereumjs-util";
let abi = require("ethereumjs-abi");
const ethUtils = require("ethereumjs-util");


const Sdk = () => {

  const { ethereum } = window;
  const [showAddress, setAddress] = useState(null);

  const provider = new Web3.providers.HttpProvider(
    "https://data-seed-prebsc-2-s2.binance.org:8545/"
  );

  const biconomy = new Biconomy(provider, {
    walletProvider: provider,
    apiKey: "6ujh2YlQ7.4a17742d-df9f-492b-8d08-daae9dafe9a4",
    debug: false,
    contractAddresses: ["0x9d7E73478800631a417E05cDe3d74D86CaC117F0"],
  });

  
  const web3 = new Web3(biconomy);

  let contractAddress = "0x9d7E73478800631a417E05cDe3d74D86CaC117F0";

  const constructMetaTransactionMessage = (
    nonce,
    chainId,
    functionSignature,
    contractAddress
  ) => {
    return abi.soliditySHA3(
      ["uint256", "address", "uint256", "bytes"],
      [nonce, contractAddress, chainId, ethUtils.toBuffer(functionSignature)]
    );
  };

  const getSignatureParameters = (signature) => {
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
      v: v,
    };
  };

  let accounts;
  const connectWallet = async () => {
    accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("accounts", accounts);
    setAddress(accounts[0]);
  };

  const transfer = async () => {
    console.log("transfer function");

    biconomy.onEvent(biconomy.READY, async () => {
      console.log("biconomy connected!!");
    });

    console.log(contractAddress);
    const contractInstance = new web3.eth.Contract(Token_Abi2, contractAddress);
    let nonce = await contractInstance.methods.getNonce(showAddress).call();
    let functionSignature = contractInstance.methods
      .transfer("0x875CcB19748c7B68Bad7C73D4a8FFdCE2507Ed6a", 420)
      .encodeABI();
    let chainId = 97;
    //same helper constructMetaTransactionMessage used in SDK front end code
    console.log("===================here=======================");
    let messageToSign = constructMetaTransactionMessage(
      nonce,
      chainId,
      functionSignature,
      contractAddress
    );
    console.log("===================here=======================");

    let { signature } = web3.eth.accounts.sign(
      "0x" + messageToSign.toString("hex"),
      `0x${privateKey}`
    );
    let { r, s, v } = getSignatureParameters(signature); // same helper used in SDK frontend code

    let estimatedGas = await contractInstance.methods
      .executeMetaTransaction(showAddress, functionSignature, r, s, v)
      .estimateGas({ from: showAddress });
    console.log("estimatedGas---->>>>>", estimatedGas);

    let executeMetaTransactionData = contractInstance.methods
      .executeMetaTransaction(showAddress, functionSignature, r, s, v)
      .encodeABI();

    web3.eth.getGasPrice().then(console.log);
    let txParams = {
      from: showAddress,
      to: contractAddress,
      value: "0x0",
      gas: "10000000", // (optional) your custom gas limit
      data: executeMetaTransactionData,
    };
    const signedTx = await web3.eth.accounts.signTransaction(
      txParams,
      `0x${privateKey}`
    );
    console.log("=================signed===================");
    console.log(signedTx);
    try {
      console.log("adsfsadfsafdsadfsafd");

      let receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        (error, txHash) => {
          if (error) {
            // return console.error(error);
            console.log("=================error===================");
            console.log(error);
          }
          console.log("Transaction hash is ", txHash);
          // do something with transaction hash
        }
      );

      console.log(receipt.transactionHash);
      console.log("=================completed===================");
    } catch (error) {
      console.log("error aa gayi =========");
      console.log(error);
    }

    // const contract = new web3.eth.Contract(Token_Abi2, contractAddress);
    // try {
    //   console.log("transfer", contractInstance);
    //   console.log("showaddress", showAddress);
    //   console.log("walletAddress", walletAddress);
    //   // let sig = await contractInstance.methods.transfer(showAddress, walletAddress).encodeABI();
    //   console.log("sig", functionSignature);
    //   //   let nonce = await contractInstance.methods.getNonce(showAddress).call();
    //   //   console.log("nonce", nonce);
    //   let nonce = await contract.methods.getNonce(showAddress).call();
    //   let chainId = 97;
    //   let functionSignature = contractInstance.methods
    //     .transfer(
    //       "0x875CcB19748c7B68Bad7C73D4a8FFdCE2507Ed6a",
    //       4200000000000000
    //     )
    //     .encodeABI();
    //   let messageToSign = constructMetaTransactionMessage(
    //     nonce,
    //     chainId,
    //     // CHAIN_ID,
    //     functionSignature,
    //     contractAddress
    //   );
    //   console.log("messageToSign", messageToSign);
    //   let { signature } = web3.eth.accounts.sign(
    //     "0x" + messageToSign.toString("hex"),
    //     `0x${privateKey}`
    //   );
    //   console.log("signature", signature);
    //   let { r, s, v } = getSignatureParameters(signature);
    //   console.log(
    //     "showAddress,sig, r, s, v",
    //     showAddress,
    //     functionSignature,
    //     r,
    //     s,
    //     v
    //   );
    //   const tx = await contractInstance.methods
    //     .executeMetaTransaction(showAddress, functionSignature, r, s, v)
    //     .encodeABI();
    //   console.log("tx", tx);
    //   if (!tx) {
    //     return console.log("Something went Wrong in tx");
    //   }
    //   let estimatedGas = await contractInstance.methods
    //     .executeMetaTransaction(showAddress, functionSignature, r, s, v)
    //     .estimateGas({ from: showAddress });
    //   console.log("estimatedGas", estimatedGas);
    //   if (!estimatedGas) {
    //     return console.log("Something went Wrong in estimatedGas");
    //   }
    //   const txParams = {
    //     from: showAddress,
    //     to: contractAddress,
    //     gas: web3.utils.toHex(estimatedGas), //gas= "10000000",
    //     // gasPrice: await this.web3.eth.getGasPrice(),
    //     value: "0x0",
    //     //gasLimit: this.web3.utils.toHex((Number(estimatedGas)).toFixed()),
    //     data: tx,
    //   };
    //   // let txParams = {
    //   //     "from": showAddress,
    //   //     "to": contractAddress,
    //   //     "value": "0x0",
    //   //     "gas": "10000000", // (optional) your custom gas limit
    //   //     "data": tx
    //   // };
    //   console.log("txParams", txParams);
    //   // const signedTx = await web3.eth.accounts.signTransaction(txParams,showAddress.privateKey);
    //   const signedTx = await web3.eth.accounts.signTransaction(
    //     txParams,
    //     `0x${privateKey}`
    //   );
    //   console.log("signedTx", signedTx);
    //   console.log("============================");
    //   const receipt = await web3.eth.sendSignedTransaction((error, txHash) => {
    //     if (error) {
    //       console.log("error", error);
    //     } else {
    //       console.log("txHash", txHash);
    //       console.log("==============done==============");
    //       // return { transactionHash: txHash, error: false };
    //     }
    //   });
    //   return { transactionHash: receipt.transactionHash, error: false };
    // } catch (err) {
    //   console.log("err------------>>>>>>>>>>>>", err);
    // }
  };

  let privateKey =
    "30f6f8e9d63ca92a75b34c868c5022a2c935bec2110efa4112057aad5f70dc48";

  return (
    <div>
      <h1>Biconomy</h1>
      <button onClick={connectWallet}>Connect</button>
      <p>{showAddress}</p>

      {/* <form onSubmit={transfer}>
			<p> Reciever Address </p>
			<input type='text' id='recieverAddress'/>

			<p> Send Amount </p>
			<input type='text' id='sendAmount' />

			<button type='submit' >Send</button>
		</form> */}

      <button onClick={transfer}>Transfer</button>
    </div>
  );
};

export default Sdk;
