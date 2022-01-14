import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import detectEthereumProvider from "@metamask/detect-provider";
import Torus from "@toruslabs/torus-embed";
import { DeFiWeb3Connector } from 'deficonnect'
import Web3 from "web3";
import './App.css';


export default function App() {

  const [ centredModal, setCentredModal ] = useState(false);
  const [ accounts, setAccounts ] = useState("");
  // const [ contract, setContract ] = useState(null);
  const [ address, setAddress ] = useState("");
  const [ walletType, setWalletType ] = useState("");
  const [ web3Ins, setWeb3Ins ] = useState("")
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    detectEthereumProvider().then((provider) => {
      if(provider) {
        setContract(provider);
        window.ethereum.request({
          method: 'eth_accounts'
        }).then((accounts) => {
          const addr = (accounts.length <= 0) ? '' : accounts[0];
          if (accounts.length > 0) {
            setAddress(addr);
          }
        }).catch((err) => {
          console.log(err);
        });
      }    
    }).catch ((err) => {
      console.log(err);
    });
  }, [])

  useEffect(() => {
    if ( window.ethereum ) {
      window.ethereum.on('accountsChanged', async function (accounts) {
        if ( web3Ins ) {
          console.log("load");
          setAccounts(accounts[0]);   
          setAddress(accounts[0]);
          let amount = await web3Ins.eth.getBalance(accounts[0]);
          setBalance(amount);
        }
      });
    }
  }, [web3Ins])

  const connectMetamask = async () => {
    const currentProvider = await detectEthereumProvider();
      if (currentProvider) {
          // let web3InstanceCopy = new Web3(currentProvider);
          // setWeb3Instance(web3InstanceCopy);
          if (!window.ethereum.selectedAddress) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
          }
          await window.ethereum.enable();
          let currentAddress = window.ethereum.selectedAddress;
          console.log(currentAddress);
          setAccounts(currentAddress);   
          setAddress(currentAddress);
          const web3 = new Web3(currentProvider);
          let amount = await web3.eth.getBalance(currentAddress);
          amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
          setWeb3Ins(web3);
          setBalance(amount);
          setWalletType("MetaMask");
      } else {
          console.log('Please install MetaMask!');
      }

  }

  const connectDefi = async () => {
    const connector = new DeFiWeb3Connector({
      supportedChainIds: [1,338],
      rpc: {1: 'https://mainnet.infura.io/v3/17e978710e44440cadf40a13e0ebeaff',
      338:"https://cronos-testnet-3.crypto.org:8545",
    },
      pollingInterval: 15000,
    })
    await connector.activate();
    const provider = await connector.getProvider();
    const web3 = new Web3(provider);
    const address = (await web3.eth.getAccounts())[0];
    setAddress(address);
    let amount = await web3.eth.getBalance(address);
    console.log(amount);
    amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
    setWeb3Ins(web3);
    setBalance(amount);
    setWalletType("Defi Wallet");
  }

  const disconnect = async () => {
      setAccounts('');
      setAddress('');
  }


  //Load the contract and Function

//Load The Contract Content
const [contract,setContract] = useState(null);
const [brandName,setBrandName] =useState([]);
useEffect(() => {
const loadContract = async ()=>{
 const contractFile = await fetch('/abis/BrandName.json');
 //error in build Because need to give react The permission 
 //const contractFile = await fetch('../build/contracts.BrandName.json');

 console.log(contractFile)
 const convertContractFileToJson =  await contractFile.json();
 console.log(convertContractFileToJson,"contract Convert File")

 const abi = await convertContractFileToJson.abi;
 const networkId =  await web3Ins.eth.net.getId();

 const networkObject = convertContractFileToJson.networks[networkId]

 if(networkObject){
  const address  = await networkObject.address;
  console.log(address);
  const deployedContract = await  new web3Ins.eth.Contract(abi,address); 
  setContract(deployedContract);

  console.log(deployedContract);

  const brandName = await deployedContract.methods.name().call();
  setBrandName(brandName);



 }else{
   window.alert("Please connect with Ropsten Network")
 }
  
}
web3Ins &&loadContract();
}, [web3Ins])

  const toggleShow = () => setCentredModal(!centredModal);


  return (
    <div className='App'>
        <header>
        <div
            id='intro-example'
            className='p-5 text-center bg-image'
            style={{ backgroundImage: "url('background.png')"}}
        >
            <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className='d-flex justify-content-center align-items-center h-100'>
                <div className='text-white'>
                <h1 className='mb-3'><strong>CONNECTING WALLET</strong></h1>
                <h4 className='mb-3'>Choose different types of wallet you want</h4>
                <button className='btn btn-outline-light btn-lg' onClick={toggleShow}>
                    Connect Wallet
                </button><br/><br/>
                {
                    address && 
                    <>
                    <h3>DATA: {brandName}</h3>
                        <h3>Address: {address}</h3>

                        <h3>BalanceOF: {balance}ETH</h3>
                    </>
                }
                </div>
            </div>
            </div>
        </div>
        <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
            <MDBModalDialog centered>
            <MDBModalContent>
                <MDBModalHeader className="modalheader">
                <MDBModalTitle>Connect Wallet</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                </MDBModalHeader>
                {
                    !address ?
                    <MDBModalBody>
                        <div className="row">
                            <div className="col-sm-6 mb-4">
                            <img className="walleticon" src="icon/metamask.png"/>
                            <button type="button" className="btn btn-outline-primary" data-mdb-ripple-color="dark" onClick={connectMetamask}>MetaMask</button>
                            </div>
                      
                        </div>
                    
                        <div className="row">
                            <div className="col-sm-6 mb-4">
                            <img className="walleticon" src="icon/defi.png"/>
                            <button type="button" className="btn btn-outline-primary" data-mdb-ripple-color="dark" onClick={connectDefi}>Defiwallet</button>
                            </div>
                        </div>
                    </MDBModalBody> :
                    <div>
                        <MDBModalBody>
                            <h5>You are currently connected to <strong>{address}</strong> via <strong>{walletType}</strong></h5>
                        </MDBModalBody>
                        <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={toggleShow}>
                            Close
                        </MDBBtn>
                        <MDBBtn onClick={disconnect}>Disconnect</MDBBtn>
                        </MDBModalFooter>
                    </div>
                }
            </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
        </header>
    </div>
  );
}