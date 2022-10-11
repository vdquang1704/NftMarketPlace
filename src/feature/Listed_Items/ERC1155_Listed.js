import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Button, Table, Form } from 'react-bootstrap'

export default function ERC1155_Listed({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  // const [amount, setAmount] = useState(null)
  // const [price, setPrice] = useState(null)
  
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace._listingIds();
    console.log("itemCount: ", itemCount.toString() )
    let listedItems = []
    // let soldItems = []
    console.log("check list")
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.ERC1155List(indx)
        if (i.seller.toLowerCase() === account) {
          
       // define listed item object
      let item = {
        itemId: i.itemId,
        nftAddress: i.nftAddress,
        tokenId: i.tokenId,
        price: i.price,
        token: i.tokenAvailable
      
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

  const cancelListingItem = async (listingId, address, tokenId) => {
    await(await marketplace.cancelListingERC1155(listingId, address, tokenId)).wait()
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
            <th>Token ID</th>
            <th>Token Available</th>
            <th>Cancel Listing</th>
            {/* <th>Update Listing</th> */}
          </tr>
        </thead>
        <tbody>
            {listedItems.map((item, idx) => (
              <tr>
              <td>{item.nftAddress}</td>
              <td>{(item.tokenId).toString()}</td>
              <td>{ethers.utils.formatEther(item.token)}</td>
              <td>
                <Button onClick={() =>
               cancelListingItem(item.itemId, item.nftAddress, item.tokenId)}
               variant="primary" size="sm">
                Cancel this ERC1155
               </Button></td>
               
            </tr>
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