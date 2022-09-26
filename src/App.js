// import logo from './logo.svg';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/Home.js';
import MyPurchases from "./components/MyPurchases.js";
import Navigation from "./components/NavBar.js";

import List_ERC721 from "./feature/Listing_Items/ERC721List.js";
import List_ERC1155 from "./feature/Listing-Items/ERC1155List.js";
import List_ERC20 from "./feature/Listing_Items/ERC20List.js"

import ERC721_Listed from "./feature/Listed_Items/ERC721_Listed.js";
import ERC1155_Listed from "./feature/Listed_Items/ERC1155_Listed.js";
import ERC20_Listed from "./feature/Listed_Items/ERC20_Listed.js";

import MarketplaceABI from "./ABI/NftMarketplace.json"
import MarketplaceAddress from "./ABI/NftMarketplace-address.json"
import { useState } from "react";
import { ethers } from "ethers";
import { Spinner} from "react-bootstrap";

import './App.css'


function App() {
  
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceABI.abi, signer)
    setMarketplace(marketplace)
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/list-ERC721" element={
                <List_ERC721 marketplace={marketplace} nft={nft} />
              } />
              <Route path="/list-ERC1155" element={
                <List_ERC1155 marketplace={marketplace} nfts={nft} />
              } />
              <Route path="/list-ERC20" element={
                <List_ERC20 marketplace={marketplace} />
              } />
              
              <Route path="/listed-ERC721" element={
                <ERC721_Listed marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/listed-ERC1155" element={
                <ERC1155_Listed marketplace={marketplace} nfts={nft} account={account} />
              } />
              <Route path="/listed-ERC20" element={
                <ERC20_Listed marketplace={marketplace} account={account} />
              } />

             <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
