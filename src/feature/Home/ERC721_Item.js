import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Row, Button, Table } from "react-bootstrap"

const Home_ERC721 = ({ marketplace, nft }) => {
 const [loading, setLoading] = useState(true)
 const [listedItems, setListedItems] = useState([])
 const loadMarketplaceItems = async () => {
  // Load all unsold items
  const itemCount = await marketplace.ERC721Count()
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
     <Row xs={1} md={12} lg={12} className="g-4 py-5">
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
            <Button onClick={() =>
           buyMarketItem(item.itemId, {value: item.price})}
           variant="primary" size="sm">
            Buy for {ethers.utils.formatEther
            (item.price)} ETH
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
export default Home_ERC721