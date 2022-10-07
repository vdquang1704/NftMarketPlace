import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'


const List_ERC20 = ({ marketplace, token }) => {
  // const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [amount, setAmount] = useState(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  

  
  const listERC20 = async () => {
    if (!price || !name || !description || !amount || !address) return 
    try {
     createERC20()
    } catch(error) {
      console.log("List ERC20 error", error)
    }
  }
  

  const createERC20 = async () => {
    
    const listingAmount = ethers.utils.parseEther(amount.toString())
    const listingPrice = ethers.utils.parseEther(price.toString())
    // mint nft
    await(await token.mint(address, listingAmount)).wait()
  
    await(await token.approve(marketplace.address, listingAmount)).wait()
    // add nft to marketplace
   
    await(await marketplace.listItemERC20(token.address, listingAmount, listingPrice)).wait()
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
              <Form.Control onChange={(e) => setAddress(e.target.value)} size="lg" required type="text" placeholder="Address" />
              <Form.Control onChange={(e) => setAmount(e.target.value)} size="lg" required type="number" placeholder="Amount" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={listERC20} variant="primary" size="lg">
                  List ERC20 !
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}
export default List_ERC20