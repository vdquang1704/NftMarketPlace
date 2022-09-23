import { useState } from "react"
import { ethers } from "ethers"
import { Row, Form, Button } from "react-bootstrap"

const ERC20List = ({ marketplace, token }) => {
    const [price, setPrice] = useState(null)
    const [name, setName] = useState('')
    const [amount, setAmount] = useState(null)
    const [description, setDescription] = useState('')

    const listERC20 = async () => {
        if (!price || !name || !amount || !description) return
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{maxWidth: "1000px"}}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                            type="file"
                            required
                            name="file"
                        />
                        <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name"/>
                        <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required type="textarea" placeholder="Description"/>
                        <Form.Control onChange={(e) => setAmount(e.target.value)} size="lg" required type="number" placeholder="Amount"/>
                        <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Amount"/>
                        <div className="d-grid px-0">
                            <Button onClick={listERC20} variant="primary" size="lg">
                                listERC20
                            </Button>
                            
                        </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    )
    
}