import React, { useState, useEffect } from 'react';
import detectEthereumProvider from "@metamask/detect-provider";
import { DeFiWeb3Connector } from 'deficonnect'
import Web3 from "web3";

const  web3Custom = ()=>{
    const[web3Api,setWe3Api] = useState({
        provider:null,
        web3:null,
        account:null,
        isLoading:false
    })

    

    const [ walletType, setWalletType ] = useState("");

    const [balance, setBalance] = useState(0);


 

    useEffect(() => {
      detectEthereumProvider().then((provider) => {
        if(provider) {
          setWe3Api({provider:provider});
          window.ethereum.request({
            method: 'eth_accounts'
          }).then((accounts) => {
            const addr = (accounts.length <= 0) ? '' : accounts[0];
            if (accounts.length > 0) {
              setWe3Api({account:addr});
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
          if ( web3Api.web3 ) {
            console.log("load");
            // setAccounts(accounts[0]);   
            // setAddress(accounts[0]);
            setWe3Api({account:accounts[0]});
  
            let amount = await web3Api.web3.eth.getBalance(accounts[0]);
            setBalance(amount);
          }
        });
      }
    }, [web3Api.web3])
  
    const connectMetamask = async () => {
      const currentProvider = await detectEthereumProvider();
        if (currentProvider) {
            // let web3ApitanceCopy = new Web3(currentProvider);
            // setWe3Api.web3tance(web3Api.web3tanceCopy);
            if (!window.ethereum.selectedAddress) {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
            }
            await window.ethereum.enable();
            let currentAddress = window.ethereum.selectedAddress;
            console.log(currentAddress);
            // setAccounts(currentAddress);   
            // setAddress(currentAddress);
            // setWe3Api({account:currentAddress});
  
            const web3 = new Web3(currentProvider);
            let amount = await web3.eth.getBalance(currentAddress);
            amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
            // setWe3Api.web3(web3);
            setWe3Api({
              web3:web3,
              account:currentAddress
          })
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
      // setAddress(address);
      let amount = await web3.eth.getBalance(address);
      console.log(amount);
      amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
  
      // setWe3Api.web3(web3);
      setWe3Api({
        web3:web3,
        account:address
    })
    // setWe3Api(api=>({...api,web3:web3}))
  
      setBalance(amount);
      setWalletType("Defi Wallet");
    }
  
    const disconnect = async () => {
        // setAccounts('');
        // setAddress('');
        setWe3Api({
        
          account:""
      })
    }

    return{
        web3Api,connectDefi,connectMetamask,disconnect
    }

}

export default web3Custom;