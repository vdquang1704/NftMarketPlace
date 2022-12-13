import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Row, Table} from "react-bootstrap"

export default function ERC20_Purchases({ marketplace, nft, account }) {
    const [loading, setLoading] = useState(true)
    const [purchases, setPurchases] = useState([])
    console.log("check loadPurchasedItem")
    const loadPurchasedItems = async () => {
        //Fetch purchased items from marketplace by querying Offered events with the buyer set as the user
        const filter = marketplace.filters.ERC20Sold(null, null, account, null, null)
        console.log("check filter")
        const results = await marketplace.queryFilter(filter)
        //Fetch metadata of each nft and add to listedItem object
        console.log("check Promise")
        const purchases = await Promise.all(results.map(async i => {
            // fetch arguments from each result
            i = i.args
            // get uri from nft contract
            // const uri = await nft.tokenURI(i.tokenId)
            // get uri to fetch the nft metadata stored on ipfs
            // const response = await fetch(uri)
            // const metadata = await response.json()
            // get total price of item (item price + fee)
            // const totalPrice = await marketplace.getTotalPrice(i.itemId)
            // define listed item object
            let purchasedItem = {
                tokenAddress: i.tokenAddress,
                amount: i.amount
            }
            return purchasedItem

        }))
        console.log("check Loading")
        setLoading(false)
        setPurchases(purchases)
    }
    useEffect(() => {
        loadPurchasedItems()
    }, [])
    if (loading) return (
        <main style={{ padding: "1rem 0"}}>
            <h2>Loading...</h2>
        </main>
    )
    console.log(purchases)
    
    return (
        <div className="flex justify-center">
          {purchases.length > 0 ?
            <div className="px-5 container">
              <Row xs={1} md={12} lg={12} className="g-4 py-5">
              <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nft Address</th>
            <th>Amount</th>
            
          </tr>
        </thead>
        <tbody>
               
                {purchases.map((item, idx) => (
                 <tr>
                 <td>{item.tokenAddress}</td>
                 <td>{ethers.utils.formatEther(item.amount)}</td>
                 
              </tr>
                  // <Col key={idx} className="overflow-hidden">
                  //   <Card>
                  //     {/* <Card.Img variant="top" src={item.image} /> */}
                  //     <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                  //   </Card>
                  // </Col>
                ))}
               </tbody>
             </Table>
              </Row>
            </div>
            : (
              <main style={{ padding: "1rem 0" }}>
                <h2>No purchases</h2>
              </main>
            )}
        </div>
      );
}