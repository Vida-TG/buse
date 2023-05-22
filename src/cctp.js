const Web3 = require('web3');
const fetch = require('fetch');

const tokenMessengerAbi = require('./abis/cctp/TokenMessenger.json');
const messageAbi = require('./abis/cctp/Message.json');
const usdcAbi = require('./abis/Usdc.json');
const messageTransmitterAbi = require('./abis/cctp/MessageTransmitter.json');

const waitForTransaction = async (web3, txHash) => {
  let transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
  while (transactionReceipt != null && transactionReceipt.status === 'FALSE') {
    transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    await new Promise(r => setTimeout(r, 4000));
  }
  return transactionReceipt;
};

const main = async () => {
  // Check if MetaMask is available
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new Web3(window.ethereum);
    const web3 = new Web3(provider);

    // Testnet Contract Addresses
    const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS = "0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8";
    const USDC_ETH_CONTRACT_ADDRESS = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
    const ETH_MESSAGE_CONTRACT_ADDRESS = "0x1a9695e9dbdb443f4b20e3e4ce87c8d963fda34f";
    const AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79';

    // Initialize contracts using address and ABI with the new provider
    const ethTokenMessengerContract = new web3.eth.Contract(tokenMessengerAbi, ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS);
    const usdcEthContract = new web3.eth.Contract(usdcAbi, USDC_ETH_CONTRACT_ADDRESS);
    const ethMessageContract = new web3.eth.Contract(messageAbi, ETH_MESSAGE_CONTRACT_ADDRESS);
    const avaxMessageTransmitterContract = new web3.eth.Contract(
      messageTransmitterAbi,
      AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS
    );

    // AVAX destination address
    const mintRecipient = await window.ethereum.request({ method: 'eth_accounts' });
    const destinationAddressInBytes32 = await ethMessageContract.methods.addressToBytes32(mintRecipient).call();
    const AVAX_DESTINATION_DOMAIN = 1;

    // Amount that will be transferred
    const amount = process.env.AMOUNT;

    // STEP 1: Approve messenger contract to withdraw from our active eth address
    const approveTxGas = await usdcEthContract.methods.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount).estimateGas();
    const approveTx = await usdcEthContract.methods
      .approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount)
      .send({ gas: approveTxGas });
    const approveTxReceipt = await waitForTransaction(web3, approveTx.transactionHash);
    console.log('ApproveTxReceipt: ', approveTxReceipt);

    // STEP 2: Burn USDC
    const burnTxGas = await ethTokenMessengerContract.methods
      .depositForBurn(amount, AVAX_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS)
      .estimateGas();
    const burnTx = await ethTokenMessengerContract.methods
      .depositForBurn(amount, AVAX_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS)
      .send({ gas: burnTxGas });
    const burnTxReceipt = await waitForTransaction(web3, burnTx.transactionHash);
    console.log('BurnTxReceipt: ', burnTxReceipt);

    // STEP 3: Retrieve message bytes from logs
    const transactionReceipt = await web3.eth.getTransactionReceipt(burnTx.transactionHash);
    const eventTopic = web3.utils.keccak256('MessageSent(bytes)');
    const log = transactionReceipt.logs.find((l) => l.topics[0] === eventTopic);
    const messageBytes = web3.eth.abi.decodeParameters(['bytes'], log.data)[0];
    const messageHash = web3.utils.keccak256(messageBytes);

    console.log(`MessageBytes: ${messageBytes}`);
    console.log(`MessageHash: ${messageHash}`);

    // STEP 4: Fetch attestation signature
    let attestationResponse = { status: 'pending' };
    while (attestationResponse.status != 'complete') {
      const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
      attestationResponse = await response.json();
      await new Promise((r) => setTimeout(r, 2000));
    }

    const attestationSignature = attestationResponse.attestation;
    console.log(`Signature: ${attestationSignature}`);

    // STEP 5: Using the message bytes and signature receive the funds on the destination chain and address
    web3.setProvider(process.env.AVAX_TESTNET_RPC); // Connect web3 to AVAX testnet
    const receiveTxGas = await avaxMessageTransmitterContract.methods
      .receiveMessage(messageBytes, attestationSignature)
      .estimateGas();
    const receiveTx = await avaxMessageTransmitterContract.methods
      .receiveMessage(messageBytes, attestationSignature)
      .send({ gas: receiveTxGas });
    const receiveTxReceipt = await waitForTransaction(web3, receiveTx.transactionHash);
    console.log('ReceiveTxReceipt: ', receiveTxReceipt);
  } else {
    // MetaMask not available
    console.error('MetaMask extension not detected');
  }
};

main();

import React from 'react'

export const Cctp = () => {

    
    useEffect(() => {
        main()
    }, []);

  return (
    <div>cctp</div>
  )
}

export default Cctp