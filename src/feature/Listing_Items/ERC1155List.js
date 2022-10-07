import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'


const List_ERC1155 = ({ marketplace, nft }) => {
  // const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [amount, setAmount] = useState(null)
  const [tokenId, setTokenId] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  

  
  const listERC1155 = async () => {
    if (!price || !name || !description || !amount || !tokenId) return 
    try {
     createERC1155()
    } catch(error) {
      console.log("List ERC1155 error", error)
    }
  }
  

  const createERC1155 = async () => {
    const listingPrice = ethers.utils.parseEther(price.toString())
    const listingAmount = ethers.utils.parseEther(amount.toString())
    // mint nft
    await(await nft.mint(tokenId, listingAmount)).wait()
  
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
   
    await(await marketplace.listItemERC1155(nft.address, tokenId, listingAmount, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              {/* <Form.Control
                type="file"
                required
                name="file"
                // onChange={uploadToIPFS}
              /> */}
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setTokenId(e.target.value)} size="lg" required type="number" placeholder="TokenId" />
              <Form.Control onChange={(e) => setAmount(e.target.value)} size="lg" required type="number" placeholder="Amount" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
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
  );
}
export default List_ERC1155