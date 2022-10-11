import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Row, Button, Table, Form, Modal, Col, Card} from "react-bootstrap"

const Home_ERC20 = ({ marketplace, nft }) => {
 const [loading, setLoading] = useState(true)
 const [items, setItems] = useState([])
 const [amount, setAmount] = useState(null)
 const [show, setShow] = useState(false)
 const handleClose = () => setShow(false)
 const handleShow = () => setShow(true)
 const loadMarketplaceItems = async () => {
  // Load all unsold items
  const itemCount = await marketplace._listingERC20()
  let items = []
  for (let i=1; i <= itemCount; i++) {
    const item = await marketplace.ERC20List(i)
    if (item.price != 0) {
    items.push({
      itemId: item.itemId,
      tokenAddr: item.tokenAddress,
      price: item.price,
      seller: item.seller,
      tokenAmt: item.amount
      })
    }
  }
 
 setLoading(false)
 setItems(items)
 }

 

 const buyMarketItem = async (itemId, amount, price) => {
  await (await marketplace.buyItemERC20(itemId, amount, price)).wait()
  loadMarketplaceItems()
 }

 useEffect(() => {
  loadMarketplaceItems()
 }, [])
 if (loading) return (
  <main style={{ padding: "1rem 0" }}>
   <h2>Loading...</h2> 
  </main>
 )
 return (
  <div className="flex justify-center">
   {items.length > 0 ? 
    <div className="px-5 container">
     <Row xs={1} md={12} lg={12} className="g-4 py-5">
     <Table striped bordered hover responsive>
         <thead>
        <tr>
          <th>Token Address</th>
          <th>Seller</th>
          <th>TokenAvailable</th>
          <th>Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {items.map((item, idx) => (
        <tr>
          <td>{item.tokenAddr}</td>
          <td>{item.seller}{}</td>
          <td>{ethers.utils.formatEther(item.tokenAmt)}</td>
          <td>  <Form.Control onChange={(e) => setAmount(e.target.value)} size="sm"/></td>
          <td>
        
      <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        Buy for {ethers.utils.formatEther(item.price)}
        ETH/token
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to buy this item !</Modal.Title>
        </Modal.Header>
        
        <Col key={idx} className="overflow-hidden">
        <Card>
        <Card.Body color="primary"> 
        <Card.Text>Token Address: {item.tokenAddr}</Card.Text>
        <Card.Text>Amount: {amount}</Card.Text>
        <Card.Text>Price: {ethers.utils.formatEther(item.price)} ETH/token</Card.Text>
        </Card.Body>
        </Card>
        </Col>
       
        <Modal.Footer onHide={handleClose}>
          <Button variant="primary" onClick={() =>
           buyMarketItem(item.itemId, ethers.utils.parseEther(amount.toString()), {value: amount * item.price})}>
            YES
          </Button>
          <Button variant="secondary"  onClick={handleClose}>
            NO
          </Button>
        </Modal.Footer>
      </Modal>
    </>

           </td>
        </tr>
    
      ))}
      </tbody>
         </Table>
      
     </Row>
    </div>
    : (
     <main style={{ padding: "1rem 0" }}>
      <h2>No listed assets </h2>
     </main>
    )}
   </div>
  );
}  
export default Home_ERC20