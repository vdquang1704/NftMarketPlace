import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Row, Button, Table, Form} from "react-bootstrap"

const Home_ERC1155 = ({ marketplace, nft }) => {
 const [loading, setLoading] = useState(true)
 const [items, setItems] = useState([])
 const [amount, setAmount] = useState(null)
 const loadMarketplaceItems = async () => {
  // Load all unsold items
  const itemCount = await marketplace._listingIds()
  let items = []
  for (let i=1; i <= itemCount; i++) {
    const item = await marketplace.ERC1155List(i)
    if (item.amount != 0) {
      console.log("price: ", (item.price).toString())
      console.log("amount: ", (item.amount).toString())
      console.log("TotalPrice", (item.price * item.amount).toString())
    items.push({
      itemId: item.itemId,
      nftAddress: item.nftAddress,
      tokenId: item.tokenId,
      price: item.price,
      seller: item.seller,
      token: item.tokenAvailable
      })
    }
  }
 
 setLoading(false)
 setItems(items)
 }

 

 const buyMarketItem = async (itemId, amount, price) => {
  await (await marketplace.buyItemERC1155(itemId, amount, price)).wait()
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
          <th>Nft Address</th>
          <th>Seller</th>
          <th>Token ID</th>
          <th>TokenAvailable</th>
          <th>Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {items.map((item, idx) => (
        <tr>
          <td>{item.nftAddress}</td>
          <td>{item.seller}{}</td>
          <td>{(item.tokenId).toString()}</td>
          <td>{ethers.utils.formatEther(item.token)}</td>
          <td>  <Form.Control onChange={(e) => setAmount(e.target.value)} size="sm"/></td>
          <td>
            <Button onClick={() =>
           buyMarketItem(item.itemId, ethers.utils.parseEther(amount.toString()), {value: ethers.utils.parseEther(amount.toString()) * item.price})}
           variant="primary" size="sm">
            Buy for {ethers.utils.formatEther
            (item.price)} ETH/nft
           </Button></td>
        </tr>
      //  <Col key={idx} className="overflow-hidden">
      //   <Card>
      //    {/* <Card.Img variant="top" src={item.image} /> */}
      //    <Card.Body color="secondary">
      //     <Card.Title>
      //       nft Address {item.nftAddress}
      //       Seller {item.seller}</Card.Title>
      //     <Card.Text>
      //      {item.description}
      //     </Card.Text>
      //    </Card.Body>
      //    <Card.Footer> 
      //     <div className="d-grid">
      //      <Button onClick={() =>
      //      buyMarketItem(idx)}
      //      variant="primary" size="lg">
      //       Buy for {ethers.utils.formatEther
      //       (item.price)} ETH
      //      </Button>
      //     </div>
      //    </Card.Footer>
      //   </Card>
      //  </Col>
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
export default Home_ERC1155