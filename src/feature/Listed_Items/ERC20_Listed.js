import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Row, Col, Card } from "react-bootstrap"

function renderSoldItems(items) {
 return (
  <>
   <h2>Sold</h2>
   <Row xs={1} md={2} lg={4} className="g-4 py-4">
    {items.map((item, idx) => (
     <Col key={idx} className="overflow-hidden">
      <Card>
       <Card.Footer>
        For {ethers.utils.formatEther(item.price)} ETH 
        For {ethers.utils.formatEther(item.amount)}  Received
       </Card.Footer>
      </Card>
     </Col>
    ))}
   </Row>
  </>
 )
}

export default function ERC20_Listed({ marketplace, account }) {
 const [loading, setLoading] = useState(true)
 const [listedItems, setListedItems] = useState([])
 const [soldItems, setSoldItems] = useState(null)
 const loadListedItems = async () => {
  // Load all sold items that the user listed
  const itemCount = await marketplace._listingERC20()
  let listedItems = []
  let soldItems = []
  for (let idx = 1; idx <= itemCount; idx++) {
   const i = await marketplace.ERC20List[idx]
   if(i.seller.toLowerCase() === account) {
    
    // define listed item object
    let item = {
     price: i.price,
     tokenId: i.tokenAddress,
     amountL: i.amount
    }
    listedItems.push(item)
    // add listed item to sold items array if sold
    soldItems = marketplace.totalERC20Sold()
   }
  }
  setLoading(false)
  setListedItems(listedItems)
  setSoldItems(soldItems)
 }
 useEffect(() => {
  loadListedItems()
 }, [])
 if (loading) return (
  <main style={{ padding:"1rem 0"}}>
   <h2> Loading...</h2>
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
          <Card.Footer>
           {ethers.utils.formatEther(item.price)}ETH
           {ethers.utils.formatEther(item.amount)}
          </Card.Footer>
         </Card>
        </Col>
       ))}
      </Row>
        {soldItems.length > 0 && renderSoldItems(soldItems)}
    </div> 
    : (
     <main style={{ padding: "1rem 0" }}>
      <h2>This assets were sold !!!</h2>
     </main>
    )}
  </div>
 );
}