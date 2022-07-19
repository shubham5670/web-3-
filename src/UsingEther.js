import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Web3 from "web3";
// import TokenAbi from "./ABI/Token_Abi.json";
import TokenAbi1 from "./ABI/Token_Abi1.json";
import { ethers } from "ethers";

const UsingEther = () => {
  let web3;
  const { ethereum } = window;
  web3 = new Web3(ethereum);

  const TokenAddress1 = "0x995765e120676263764aB14781Abe228a7EDd015";
  const TokenAddress2 = "0xB8B1fF9d62eb8dcbB98bC7B8D006b8f5F873f5a3";

  const [isConnected, setIsConnected] = useState("Connect Wallet");
  const [networkConnected, setNetworkConnected] = useState("");
  const [address, setAddress] = useState(null);
  const [ethBalance, setEthBalance] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [option, setOption] = useState("");
  const [hash, setHash] = useState("");

  const connectMetamask = async () => {
    //For metamask connection
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const accounts = await provider.listAccounts();
    console.log("Account Address::", accounts[0]);
    setAddress(accounts);
    setIsConnected("Wallet Connected");

    // let wallet = new ethers.Wallet();

    //Chain Id
    const network = await provider.getNetwork();

    if (network.chainId == "1") {
      setNetworkConnected("Mainnet");
      console.log("Mainnet");
      setTokenBalance(0);
    } else if (network.chainId == "3") {
      setNetworkConnected("Ropsten Testnet");
    } else {
      setNetworkConnected(network.name);
      setTokenBalance(0);
    }

    //Balance
    const balance = await provider.getBalance(accounts[0]);
    const balance_one = (balance / 10 ** 18).toString();
    console.log("Ethereum Balance::", balance_one);
    setEthBalance(balance_one);

    //Create a contract instance
    const contract = new ethers.Contract(TokenAddress2, TokenAbi1, signer);

    // console.log("Contract::",contract)

    //Set Token Name
    const t_Name = await contract.name();
    setTokenName(t_Name);
    console.log("Name", t_Name);

    //set Token Balance
    const t_Balance = await contract.balanceOf(accounts[0]);
    const t_Balance_one = (t_Balance / 10 ** 18).toString();
    console.log("Token Balance", t_Balance_one);
    setTokenBalance(t_Balance_one);
  };

  useEffect(() => {
    window.ethereum.on("chainChanged", () => {
      if (isConnected === "Wallet Connected") {
        connectMetamask();
      }
    });
  });

  const changeNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x3" }],
    });
    setTokenBalance(0);
  };

  const transferEthToken = async (e) => {
    if (isConnected == "Wallet Connected") {
      console.log("HIT");
      e.preventDefault(); //prevent page reloading
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const provider = new ethers.providers.JsonRpcProvider()
      const signer = provider.getSigner();

      //Create a contract instance
      const contract = new ethers.Contract(TokenAddress2, TokenAbi1, signer);

      console.log(contract);

      let transferAmount = e.target.sendAmount.value * 10 ** 18;
      let tranfer_amt = transferAmount.toString();

      let recieverAddress = e.target.recieverAddress.value;
      const privateKey =
        "30f6f8e9d63ca92a75b34c868c5022a2c935bec2110efa4112057aad5f70dc48";
      const wallet = new ethers.Wallet(privateKey, provider);

      console.log("transferAmount:", provider);

      console.log("contqwertyuiract", recieverAddress);

      if (option == "Token") {
        try {
          await contract
            .transfer(recieverAddress, tranfer_amt)
            .then((result) => {
              console.log(result);
              setHash(result.hash);
            });
        } catch (error) {
          console.log(error);
        }
      } else if (option == "Ethereum") {
        try {
          //Send Ether
          const tx = await wallet.sendTransaction({
            to: recieverAddress,
            value: ethers.utils.parseEther("1"),
          });

          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", tx);
          //wait for transaction to be mined

          await tx.wait();
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert("Please connect wallet first");
    }
  };

  const approveTransc = async (e) => {
    if (isConnected === "Wallet Connected") {
      e.preventDefault(); //prevent page reloading
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Create a contract instance
      const contract = new ethers.Contract(TokenAddress2, TokenAbi1, signer);
      console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv", contract);
      let recipientAddress = e.target.recipientAddress.value;
      // setRecipientAddress(recipientAddress);
      let amount = e.target.amount.value * 10 ** 18;
      let amt = amount.toString();

      try {
        await contract.approve(recipientAddress, amt).then((result) => {
          console.log(result);
          setHash(result.hash);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please Connect wallet First.");
    }
  };

  const transferFroom = async (e) => {
    if (isConnected == "Wallet Connected") {
      e.preventDefault();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //Create a contract instance
      const contract = new ethers.Contract(TokenAddress2, TokenAbi1, signer);
      console.log(contract)
      let senderaddress = e.target.senderAdd.value;
      let recipientAddress = e.target.recipientAddress.value;
      let amount = e.target.amount.value * 10 ** 18;
      let amt = amount.toString();
      try {
        console.log("TRY");
        await contract
          .transferFrom(senderaddress, recipientAddress, amt)
          // .send({ from: address })
          .then((r) => {
            console.log("res", r);
            setHash(r.blockHash);
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please connect wallet first");
    }
  };


  return (
    <div>
      <h4>WEB3 Integration using Ethr.js</h4>
      <button onClick={connectMetamask}>{isConnected}</button>
      <br />
      <br />
      {isConnected == "Wallet Connected" ? (
        networkConnected == "Mainnet" ||
        networkConnected == "Ropsten Testnet" ? (
          networkConnected
        ) : (
          <button onClick={changeNetwork}>change network</button>
        )
      ) : (
        ""
      )}
      <h4>Network : {networkConnected}</h4>
      <h3>Wallet Address: {address}</h3>
      <h3>Balance: {ethBalance + " ETH"}</h3>
      <h3>
        {tokenName} Token : {tokenBalance}
      </h3>
      <br />
      <br />

      {/* Approve Section */}
      <form onSubmit={approveTransc}>
        <h4>Allow Recipient address to transact on my behalf </h4>
        <label>Enter the Recipient Address: </label>
        <input
          type="text"
          id="recipientAddress"
          placeholder="Enter Address"
        ></input>
        <br />
        <br />
        <label>Enter Amount: </label>
        <input type="number" id="amount" placeholder="Enter Amount"></input>
        <br />
        <br />
        <button type="submit">Approve</button>
      </form>
      <br />
      <br />

      {/* TransferFrom Section */}
      <form onSubmit={transferFroom}>
        <h3>Transfer From Functionality</h3>
        <label>Enter sender Address: </label>
        <input type="text" id="senderAdd" placeholder="Sender Address" />
        <br />
        <br />
        <label>Enter the Recipient Address: </label>
        <input
          type="text"
          id="recipientAddress"
          placeholder="Recipient Address"
        ></input>
        <br />
        <br />
        <label>Enter Amount: </label>
        <input type="number" id="amount" placeholder="Enter Amount"></input>
        <br />
        <br />
        <button type="submit">Transfer</button>
      </form>
      <br />
      <br />

      {/* Simple transfer section */}
      <h3>Simple Transfer (ETH/Token)</h3>
      <h1> {option}</h1>
      <select name="Choose" onChange={(e) => setOption(e.target.value)}>
        <option value="">select</option>
        <option value="Token">Token</option>
        <option value="Ethereum">Ethereum</option>
      </select>
      <br />
      <br />

      <form onSubmit={transferEthToken}>
        <p> Reciever Address </p>
        <input type="text" id="recieverAddress" />

        <p> Send Amount </p>
        <input type="number" id="sendAmount" />

        <button type="submit">Send</button>
        <h4>Hash : {hash}</h4>
      </form>
    </div>
  );
};
export default UsingEther;
