import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Button, Table, Form } from 'react-bootstrap'

export default function ERC721_Listed({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [price, setPrice] = useState(null)
  
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace._listingERC721();
    console.log("itemCount: ", itemCount.toString() )
    let listedItems = []
    // let soldItems = []
    console.log("check list")
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.ERC721List(indx)
        if (i.seller.toLowerCase() === account) {
          
       // define listed item object
      let item = {
        itemId: i.itemId,
        nftAddress: i.nftAddress,
        tokenId: i.tokenId,
        price: i.price,
        seller: i.seller
      }
      listedItems.push(item)
      console.log("listedItem: ", listedItems[indx])
      }
    }
    console.log("listedItems length", listedItems.length)
    console.log("check setLoading")
    setLoading(false)
    setListedItems(listedItems)
    // setSoldItems(soldItems)
  }

  const cancelListingItem = async (itemCount) => {
    await(await marketplace.cancelListingERC721(itemCount)).wait()
    loadListedItems()
  }

  const updateListingItem = async (itemId, price) => {
    await(await marketplace.updateListingERC721(itemId, price)).wait()
    loadListedItems()
  }
  
  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={12} lg={12} className="g-4 py-3">
          <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nft Address</th>
            <th>Seller</th>
            <th>Token ID</th>
            <th>Cancel Listing</th>
            <th>Update Listing</th>
          </tr>
        </thead>
        <tbody>
            {listedItems.map((item, idx) => (
              <tr>
              <td>{item.nftAddress}</td>
              <td>{item.seller}{}</td>
              <td>{(item.tokenId).toString()}</td>
              <td>
                <Button onClick={() =>
               cancelListingItem(item.itemId)}
               variant="primary" size="sm">
                Cancel this ERC721
               </Button>
               </td>
               <td>
               <Button onClick={() =>
               updateListingItem(item.itemId, ethers.utils.parseEther(price.toString()))}
               variant="primary" size="sm">
                Update this ERC721
               </Button>
               <Form.Control onChange={(e) => setPrice(e.target.value)} variant="primary" size="sm" placeholder="price"/>
               
               </td>
            </tr>
              // <Col key={idx} className="overflow-hidden">
              //   <Card>
              //     {/* <Card.Img variant="top" src={item.seller} /> */}
              //     <Card.Body color="secondary">
              //     <Card.Title>Nft Address {item.nftAddress}
              //     Seller: {item.seller}
              //     </Card.Title>
                  
              //     </Card.Body>
              //     <Card.Footer>Price: {ethers.utils.formatEther(item.price)} ETH</Card.Footer>
              //   </Card>
              // </Col>
            ))}

        </tbody>
         </Table>
          </Row>
            
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}