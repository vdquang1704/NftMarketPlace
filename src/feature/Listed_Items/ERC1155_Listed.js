import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Row, Col, Card } from "react-bootstrap"

function renderSoldItems(items) {
 return (
  <>
   <h2>Sold</h2>
   <Row xs={1} md={2} lg={4} className="g-4 py-3">
    {items.map((item, idx) => (
     <Col key={idx} className="overflow-hidden">
      <Card>
       <Card.Footer>
        For {ethers.utils.formatEther(item.price)} ETH
        For {ethers.utils.formatEther(item.amount)}
       </Card.Footer>
      </Card>
     </Col>
    ))}
   </Row>
  </>
  )
}

export default function ERC1155_Listed ({ marketplace, nfts, account }) {
 const [loading, setLoading] = useState(true)
 const [listedItems, setListedItems] = useState([])
 const [soldItems, setSoldItems] = useState([])
 const loadListedItems = async () => {
 // Load all sold items that user listed
 const itemCount = await marketplace._listingIds()
 let listedItems = []
 let soldItems = []
 for (let idx = 1; idx <= itemCount; idx++) {
  const i = await marketplace.ERC1155List[idx]
  if (i.seller.toLowerCase() === account) {
   let item = {
    address: i.nftAddress,
    price: i.price,
    tokenId: i.tokenId,
    amount: i.amount
   }
   listedItems.push(item)
   // Add listed item to sold items array if sold
    // soldItems.push(item)
   }
  }
  setLoading(false)
  setListedItems(listedItems)
  // setSoldItems(soldItems)
 }
 useEffect(() => {
  loadListedItems()
 }, [])
 if (loading) return (
  <main style={{ padding: "1rem 0"}}>
   <h2>Loading...</h2>
  </main>
 )
 return (
  <div className="flex justify-center">
   {listedItems.length > 0 ? 
    <div className="px-5 py-3 container"> 
      <h2>Listed</h2>
     <Row xs={1} md={2} lg={4} className="g-4 py-3">
      {listedItems.map((item, idx) => (
       <Col key={idx} className="overflow-hidden">
        <Card>
         <Card.Footer>{ethers.utils.formatEther(item.price)} ETH </Card.Footer>
         <Card.Footer>{ethers.utils.formatEther(item.amount)}</Card.Footer>
        </Card>
       </Col>
      ))}
     </Row>
       {soldItems.length > 0 && renderSoldItems(soldItems)}
    </div>
    : (
     <main style={{ padding: "1rem 0"}}>
       <h2> This items were sold !!!</h2>
     </main>
    )
   }
  </div>
 )
}