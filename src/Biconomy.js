import React from 'react'
import Web3 from 'web3';
import {
    helperAttributes,
    getDomainSeperator,
    getDataToSignForPersonalSign,
    getDataToSignForEIP712,
    buildForwardTxRequest,
    getBiconomyForwarderConfig
  } from './biconomyForwarderHelpers';
  import Token_Abi2 from './ABI/Token_Abi2.json';
  import sigUtil from 'eth-sig-util';
import { useState } from 'react';

// const Biconomy = async() => {
//     let web3;
//     const { ethereum } = window
//     web3 = new Web3(ethereum )

//     const contractAddress = '0x9d7E73478800631a417E05cDe3d74D86CaC117F0';
//     let userAddress = '0xdb126a7CF1a62F76A66AD3EA13bfc6EEDaA4576F';
//     let networkId = 97;
//     const [showAddress, setAddress] = useState(null);
    
//     // This web3 instance is used to get user signature from connected wallet
//     let walletWeb3 = new Web3(window.ethereum);
    
//     // Initialize Contracts
//     let contract = new web3.eth.Contract(
//         Token_Abi2,
//         contractAddress
//         );
    
//     let functionSignature = contract.methods
//                       .setQuote(newQuote)
//                       .encodeABI();

//     let txGas = await contract.methods
//                       .setQuote(newQuote)
//                       .estimateGas({ from: userAddress });
                      
//     let forwarder = await getBiconomyForwarderConfig(networkId);

//     let forwarderContract = new web3.eth.Contract(
//               forwarder.abi,
//               forwarder.address
//             );
    
//     //const batchId = await forwarderContract.methods.getBatch(userAddress).call();
//     const batchNonce = await forwarderContract.methods.getNonce(address,0).call();
//     const gasLimitNum = Number(txGas);
//     const to = '0x9d7E73478800631a417E05cDe3d74D86CaC117F0';
    
//     const request = await buildForwardTxRequest({account:userAddress,to,gasLimitNum,batchId,batchNonce,data:functionSignature});
    
//     /* If you wish to use EIP712 Signature type check below code*/
    
    
//     const hashToSign = getDataToSignForPersonalSign(request);
//     const sig = await walletWeb3.eth.personal.sign("0x" + hashToSign.toString("hex"), userAddress);
//     sendTransaction({userAddress, request, sig, signatureType:biconomy.PERSONAL_SIGN});
//     // notice domain seperator is not passed here
    
//     ///////////////////////////////////////////////////////////
    
//      // If you wish to use EIP712 Signature type  
//      //build the request as mentioned above
//        const domainSeparator = await getDomainSeperator(42);
//        console.log(domainSeparator);
//        const dataToSign =  await getDataToSignForEIP712(request,networkId);
       
    
//      walletWeb3.currentProvider.send(
//         {
//             jsonrpc: "2.0",
//             id: 999999999999,
//             method: "eth_signTypedData_v4",
//             params: [userAddress, dataToSign]
//             },
//             function (error, response) {
//                 console.info(`User signature is ${response.result}`);
//                 if (error || (response && response.error)) {
//                     showErrorMessage("Could not get user signature");
//                     } else if (response && response.result) {
//                         let sig = response.result;
//                         sendTransaction({userAddress, request, domainSeparator, sig, signatureType:biconomy.EIP712_SIGN});
//                         }
//             }
//         );

//         const sendTransaction = async ({userAddress, request, sig, domainSeparator, signatureType}) => {
//             if (web3 && contract) {
//               let params;
//               if (domainSeparator) {
//                 params = [request, domainSeparator, sig];
//               } else {
//                 params = [request, sig];
//               }
//               try {
//                 fetch(`https://api.biconomy.io/api/v2/meta-tx/native`, {
//                   method: "POST",
//                   headers: {
//                     "x-api-key": 'Yo0MFkUSp.97fbcc2b-e651-4527-9ea0-c3e1d2287f81',
//                     "Content-Type": "application/json;charset=utf-8",
//                   },
//                   body: JSON.stringify({
//                     to: '0x9d7E73478800631a417E05cDe3d74D86CaC117F0',
//                     apiId: '',
//                     params: params,
//                     from: userAddress,
//                     signatureType: signatureType
//                   }),
//                 })
//                   .then((response) => response.json())
//                   .then(async function (result) {
//                     console.log(result);
//                     showInfoMessage(
//                       `Transaction sent by relayer with hash ${result.txHash}`
//                     );
    
//                     let receipt = await getTransactionReceiptMined(
//                       result.txHash,
//                       2000
//                     );
//                     setTransactionHash(result.txHash);
//                     showSuccessMessage("Transaction confirmed on chain");
//                     getQuoteFromNetwork();
//                   })
//                   .catch(function (error) {
//                     console.log(error);
//                   });
//               } catch (error) {
//                 console.log(error);
//               }
//             }
//         };


//         const getTransactionReceiptMined = (txHash, interval) => {
//             const self = this;
//             const transactionReceiptAsync = async function(resolve, reject) {
//               var receipt = await web3.eth.getTransactionReceipt(txHash);
//               if (receipt == null) {
//                   setTimeout(
//                       () => transactionReceiptAsync(resolve, reject),
//                       interval ? interval : 500);
//               } else {
//                   resolve(receipt);
//               }
//             };
        
//             if (typeof txHash === "string") {
//                 return new Promise(transactionReceiptAsync);
//             } else {
//                 throw new Error("Invalid Type: " + txHash);
//             }
//           };


//      const connectWallet = async() => {
//         const accounts = await ethereum.request({
//             method: "eth_requestAccounts"
//         })
//         console.log("accounts",accounts);
//         setAddress(accounts[0])
//      }
      
//   return (
//     <div>
//         Biconomy
//         <button onClick={connectWallet}></button>
//         <p>{showAddress}</p>
//     </div>
//   )
// }

export default Biconomy