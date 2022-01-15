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
import MainPart from './MainPart';
import Web3Provider from './web3';


export default function App() {



  return (
    <Web3Provider>
          <div className='App'>
            <>
            
            <MainPart/>
            </>
            
          </div>
    </Web3Provider>
  );
}