import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Button, Table } from 'react-bootstrap'

export default function ERC20_Listed({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace._listingERC20();
    console.log("itemCount: ", itemCount.toString() )
    let listedItems = []
    // let soldItems = []
    console.log("check list")
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.ERC20List(indx)
        if (i.seller.toLowerCase() === account) {
          
       // define listed item object
      let item = {
        itemId: i.itemId,
        tokenAddress: i.tokenAddress,
        price: i.price,
        amount: i.amount
      }
      listedItems.push(item)
      console.log("listedItem: ", listedItems[indx])
      }
    }
    console.log("check setLoading")
    setLoading(false)
    setListedItems(listedItems)
    // setSoldItems(soldItems)
  }

  const cancelListingItem = async (listingId) => {
    await(await marketplace.cancelListingERC20(listingId)).wait()
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
            <th>Token Address</th>
            <th>Token Available</th>
            <th>Token Price</th>
            <th>Cancel Listing</th>
          </tr>
        </thead>
        <tbody>
            {listedItems.map((item, idx) => (
              <tr>
              <td>{item.tokenAddress}</td>
              <td>{ethers.utils.formatEther(item.amount)}</td>
              <td>{ethers.utils.formatEther(item.price)}</td>
              <td>
                <Button onClick={() =>
               cancelListingItem(item.itemId)}
               variant="primary" size="sm">
                Cancel this ERC20
               </Button></td>
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