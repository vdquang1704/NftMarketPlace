// import logo from './logo.svg';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navigation from "./components/NavBar.js";
import background from "./asset/axie.png"
import background1 from "./asset/monkey.png"

import List_ERC721 from "./feature/Listing_Items/ERC721List.js";
import List_ERC1155 from "./feature/Listing_Items/ERC1155List.js";
import List_ERC20 from "./feature/Listing_Items/ERC20List.js"

import ERC721_Listed from "./feature/Listed_Items/ERC721_Listed.js";
import ERC1155_Listed from "./feature/Listed_Items/ERC1155_Listed.js";
import ERC20_Listed from "./feature/Listed_Items/ERC20_Listed.js";

import Home_ERC721 from "./feature/Home/ERC721_Item.js";
import Home_ERC1155 from "./feature/Home/ERC1155_Item.js";
import Home_ERC20 from "./feature/Home/ERC20_Item.js";

import ERC721_Purchases from "./feature/My purchases/ERC721_Purchases.js";
import ERC1155_Purchases from "./feature/My purchases/ERC1155_Purchases.js";
import ERC20_Purchases from "./feature/My purchases/ERC20_Purchases.js"

import MarketplaceABI from "./ABI/NftMarketplace.json"
import MarketplaceAddress from "./ABI/NftMarketplace-address.json"

import ERC20ABI from "./ABI/ERC20_Token.json"
import ERC20Address from "./ABI/ERC20_Token-address.json"

import ERC1155ABI from "./ABI/ERC1155_Token.json"
import ERC1155Address  from "./ABI/ERC1155_Token-address.json"

import ERC721ABI from "./ABI/ERC721_Token.json"
import ERC721Address from "./ABI/ERC721_Token-address.json"

import { useState } from "react";
import { ethers } from "ethers";
import { Spinner} from "react-bootstrap";

import './App.css'


function App() {
  
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [nfts, setNFTs] = useState({})
  const [token, setToken] = useState({})
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
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceABI.abi, signer || window.ethereum)
    const nft = new ethers.Contract(ERC721Address.address, ERC721ABI.abi, signer || window.ethereum)
    const nfts = new ethers.Contract(ERC1155Address.address, ERC1155ABI.abi, signer)
    const token = new ethers.Contract(ERC20Address.address, ERC20ABI.abi, signer)
    setMarketplace(marketplace)
    setNFT(nft)
    setNFTs(nfts)
    setToken(token)
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
          {/* <img src={background1} width="100%" height="100%" className="" alt="" /> */}
        </>
        <div class="content">
        
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: "background1"}}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
             
              <Route path="/list-ERC721" element={
                <List_ERC721 marketplace={marketplace} nft={nft} />
              } />
              <Route path="/list-ERC1155" element={
                <List_ERC1155 marketplace={marketplace} nft={nfts} />
              } />
              <Route path="/list-ERC20" element={
                <List_ERC20 marketplace={marketplace} token={token} />
              } />
              
              <Route path="/listed-ERC721" element={
                <ERC721_Listed marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/listed-ERC1155" element={
                <ERC1155_Listed marketplace={marketplace} nfts={nfts} account={account} />
              } />
              <Route path="/listed-ERC20" element={
                <ERC20_Listed marketplace={marketplace} token={token} account={account} />
              } />

              <Route path="/item-ERC721" element={
                <Home_ERC721 marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/item-ERC1155" element={
                <Home_ERC1155 marketplace={marketplace} nft={nfts} account={account} />
              } />
              <Route path="/item-ERC20" element={
                <Home_ERC20 marketplace={marketplace} token={token} account={account} />
              } />

              <Route path="/purchase-ERC721" element={
                <ERC721_Purchases marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/purchase-ERC1155" element={
                <ERC1155_Purchases marketplace={marketplace} nft={nfts} account={account} />
              } />
              <Route path="/purchase-ERC20" element={
                <ERC20_Purchases marketplace={marketplace} token={token} account={account} />
              } />

              {/* <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } /> */}
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
