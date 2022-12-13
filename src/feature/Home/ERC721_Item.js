import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Row, Button, Table, Card, Modal, Col} from "react-bootstrap"


const Home_ERC721 = ({ marketplace, nft }) => {
 const [loading, setLoading] = useState(true)
 const [listedItems, setListedItems] = useState([])
 const [show, setShow] = useState(false)
 const handleClose = () => setShow(false)
 const handleShow = () => setShow(true)
 const loadMarketplaceItems = async () => {
  // Load all unsold items
  const itemCount = await marketplace._listingERC721()
  console.log("itemCount", itemCount)
  let listedItems = []
  for (let idx=1; idx <= itemCount; idx++) {
    const i = await marketplace.ERC721List(idx)
    if (i.price != 0) {

    let item = {
      itemId: i.itemId,
      nftAddress: i.nftAddress,
      tokenId: i.tokenId,
      price: i.price,
      seller: i.seller
      }

      listedItems.push(item)
      console.log("listedItems length", listedItems.length)
    }
  }
 
 setLoading(false)
 setListedItems(listedItems)
 }

 const buyMarketItem = async (itemId, price) => {
  await (await marketplace.buyItemERC721(itemId, price)).wait()
  // items.remove(items(itemId-1))
  
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
   {listedItems.length > 0 ? 
    <div className="px-5 container">
     <Row xs={1} md={15} lg={15} className="g-4 py-5">
     <Table striped bordered hover responsive>
         <thead>
        <tr>
          <th>ItemId</th>
          <th>Nft Address</th>
          <th>Seller</th>
          <th>Token ID</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {listedItems.map((item, idx) => (
        <tr>
          <td>{(item.itemId).toString()}</td>
          <td>{item.nftAddress}</td>
          <td>{item.seller}</td>
          <td>{(item.tokenId).toString()}</td>
          <td>
          <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        Buy for {ethers.utils.formatEther(item.price)}
        ETH/token
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to buy this item ?</Modal.Title>
        </Modal.Header>
        
        <Col key={idx} className="overflow-hidden">
        <Card>
        <Card.Body color="primary"> 
        <Card.Text>Nft Address: {item.nftAddress}</Card.Text>
        <Card.Text>Token Id: {(item.tokenId).toString()}</Card.Text>
        <Card.Text>Price: {ethers.utils.formatEther(item.price)} ETH/token</Card.Text>
        </Card.Body>
        </Card>
        </Col>
       
        <Modal.Footer onHide={handleClose}>
          <Button variant="primary" onClick={() =>
           buyMarketItem(item.itemId, {value: item.price})}>
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
export default Home_ERC721