import { useState } from "react"
import { ethers } from "ethers"
import { Row, Form, Button } from "react-bootstrap"
// import { create as ipfsHttpClient } from "ipfs-http-client"

const List_ERC1155 = ({ marketplace, nfts }) => {
 const [price, setPrice] = useState(null)
 const [name, setName] = useState('')
 const [amount, setAmount] = useState(null)
 const [tokenId, setTokenId] = useState(null)
 const [description, setDescription] = useState('')



 const listERC1155 = async () => {
  // approve marketplace to spend nfts
  await(await nfts.setApproveForAll( marketplace.address, true)).wait()
  // add nft to marketplace
  const listingPrice = ethers.utils.parseEther(price.toString())
  const listingAmount = ethers.utils.parseEther(amount.toString())
  await(await marketplace.listItemERC1155(nfts.address, tokenId, listingAmount, listingPrice)).wait()
 }

 return (
  <div className="container-fluid mt-5">
   <div className="row">
    <main role="main" className="col-lg-12 mx-auto"
    style={{ maxWidth: "1000px" }}>
     <div className="content mx-auto">
      <Row className="g-4">
       {/* <Form.Control type="file" required name="file"/> */}
       <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
       <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
       <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
       <Form.Control onChange={(e) => setAmount(e.target.value)} size="lg" required type="number" placeholder="Amount" />
       <Form.Control onChange={(e) => setTokenId(e.target.value)} size="lg" required type="number"
       placeHolder="TokenId" />
  
       <div className="d-grid px-0">
        <Button onClick={listERC1155} variant="primary" size="lg">
         List ERC1155 !
        </Button>
       </div>
      </Row>
     </div>
    </main>
   </div>
  </div>
  )
}

export default List_ERC1155
