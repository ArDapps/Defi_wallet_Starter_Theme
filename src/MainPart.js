import React, { useState, useEffect,useContext } from 'react';
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
import { DeFiWeb3Connector } from 'deficonnect'
import Web3 from "web3";
import './App.css';
import { useWeb3 } from './web3'
import WebContext from './store/web3Context'



const MainPart = ()=> {
const ctx=useContext(WebContext)
  const [ centredModal, setCentredModal ] = useState(false);

//   const web3Api = useWeb3();
//   console.log("From index",web3Api)
//    const web33 =web3Api.web3;
const [ walletType, setWalletType ] = useState("");

const [balance, setBalance] = useState(0);



  //Load the contract and Function

//Load The Contract Content
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
 const networkId =  await ctx.web3.eth.net.getId();

 const networkObject = convertContractFileToJson.networks[networkId]

 if(networkObject){
  const address  = await networkObject.address;
  console.log(address);
  const deployedContract = await  new ctx.web3.eth.Contract(abi,address); 

  console.log(deployedContract);

  const brandName = await deployedContract.methods.name().call();
  setBrandName(brandName);



 }else{
   window.alert("Please connect with Ropsten Network")
 }
  
}
ctx.web3 &&loadContract();
}, [ctx.web3])

  
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
                    ctx.account && 
                    <>
                    <h3>DATA: {brandName}</h3>
                        <h3>Address: {ctx.account}</h3>

                        <h3>BalanceOF: {ctx.balance}ETH</h3>
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
                    !ctx.account ?
                    <MDBModalBody>
                        <div className="row">
                            <div className="col-sm-6 mb-4">
                            <img className="walleticon" src="icon/metamask.png"/>
                            <button type="button" className="btn btn-outline-primary" data-mdb-ripple-color="dark" onClick={ctx.connectMetamask}>MetaMask</button>
                            </div>
                      
                        </div>
                    
                        <div className="row">
                            <div className="col-sm-6 mb-4">
                            <img className="walleticon" src="icon/defi.png"/>
                            <button type="button" className="btn btn-outline-primary" data-mdb-ripple-color="dark" onClick={ctx.connectDefi}>Defiwallet</button>
                            </div>
                        </div>
                    </MDBModalBody> :
                    <div>
                        <MDBModalBody>
                            <h5>You are currently connected to <strong>{ctx.account}</strong> via <strong>{walletType}</strong></h5>
                        </MDBModalBody>
                        <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={toggleShow}>
                            Close
                        </MDBBtn>
                        <MDBBtn onClick={console.log("Disconnect")}>Disconnect</MDBBtn>
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
export default MainPart