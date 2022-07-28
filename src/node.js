const Web3 = require('web3')
const { Biconomy } = require('@biconomy/mexa');
const privateKey = '30f6f8e9d63ca92a75b34c868c5022a2c935bec2110efa4112057aad5f70dc48'
// const Provider = require('@truffle/hdwallet-provider');
// var provider = new Provider(privateKey, "wss://bsc-mainnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3");

const provider = new Web3.providers.HttpProvider('https://binance.nodereal.io');

const biconomy = new Biconomy(provider, { walletProvider: provider, apiKey: 'Yo0MFkUSp.97fbcc2b-e651-4527-9ea0-c3e1d2287f81', debug: false });
const web3 = new Web3(biconomy);
let abi = require('ethereumjs-abi');
const ethUtils = require("ethereumjs-util");
const contractAddress = '0x9d7E73478800631a417E05cDe3d74D86CaC117F0';
const contractABI = require('./ABI/Token_Abi2.json');
const userAddress = '0xdb126a7CF1a62F76A66AD3EA13bfc6EEDaA4576F'

const constructMetaTransactionMessage = (nonce, chainId, functionSignature, contractAddress) => {
    return abi.soliditySHA3(
        ["uint256", "address", "uint256", "bytes"],
        [nonce, contractAddress, chainId, ethUtils.toBuffer(functionSignature)]
    );
};

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

const metaTransaction = async () => {
    biconomy.onEvent(biconomy.READY, async () => {
        console.log('biconomy connected!!')
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        let nonce = await contract.methods.getNonce(userAddress).call();
        let functionSignature = contract.methods.transfer('0x875CcB19748c7B68Bad7C73D4a8FFdCE2507Ed6a', 420).encodeABI();
        let chainId = 56;

        //same helper constructMetaTransactionMessage used in SDK front end code
        let messageToSign = constructMetaTransactionMessage(nonce, chainId, functionSignature, contractAddress);
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

    }).onEvent(biconomy.ERROR, (error, message) => {
        if (error) {
            console.log('error in connection!!')
        } else {
            console.log('message')
            console.log(message)
        }
    });
}

metaTransaction()