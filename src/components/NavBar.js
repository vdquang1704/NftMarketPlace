import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container, NavDropdown } from 'react-bootstrap'
import market from '../asset/nft.png'


const Navigation = ({ web3Handler, account }) => {
    return (
        <div>
            
        <Navbar expand="lg" bg="success" variant="dark">
            <Container>
                <Navbar.Brand>
                    <img src={market} width="50" height="50" className="" alt="" />
                    &nbsp; NFT Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}
                        <Nav>
                            <NavDropdown
                            id="nav-dropdown-dark-example"
                            title="Home"
                            menuVariant="dark"
                            >
                            <NavDropdown.Item href="Item_ERC721" as={Link} to="/item-ERC721"> Items ER721
                            </NavDropdown.Item>
                            <NavDropdown.Item href="Item_ERC1155" as={Link} to="/item-ERC1155"> 
                            Items ERC1155 </NavDropdown.Item>
                            <NavDropdown.Item href="Item_ERC20" as={Link} to="/item-ERC20"> Items ERC20
                            </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        
                        <Nav>
                            <NavDropdown
                            id="nav-dropdown-dark-example"
                            title="List Nfts"
                            menuVariant="dark"
                            >
                            <NavDropdown.Item href="List_ERC721" as={Link} to="/list-ERC721"> List ERC721
                            </NavDropdown.Item>
                            <NavDropdown.Item href="List_ERC1155" as={Link} to="/list-ERC1155"> 
                            List ERC1155 </NavDropdown.Item>
                            <NavDropdown.Item href="List_ERC20" as={Link} to="/list-ERC20"> List ERC20 
                            </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <Nav>
                            <NavDropdown
                            id="nav-dropdown-dark-example"
                            title="My listed Items"
                            menuVariant="dark"
                            >
                            <NavDropdown.Item href="ERC721" as={Link} to="/listed-ERC721"> ERC721
                            </NavDropdown.Item>
                            <NavDropdown.Item href="ERC1155" as={Link} to="/listed-ERC1155"> 
                            ERC1155 </NavDropdown.Item>
                            <NavDropdown.Item href="ERC20" as={Link} to="/listed-ERC20"> ERC20 
                            </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <Nav>
                            <NavDropdown
                            id="nav-dropdown-dark-example"
                            title="My Purchases"
                            menuVariant="dark"
                            >
                            <NavDropdown.Item href="ERC721_Purchases" as={Link} to="/purchase-ERC721"> ERC721_Purchases
                            </NavDropdown.Item>
                            <NavDropdown.Item href="ERC1155_Purchases" as={Link} to="/purchase-ERC1155"> 
                            ERC1155_Purchases </NavDropdown.Item>
                            <NavDropdown.Item href="ERC20_Purchases" as={Link} to="/purchase-ERC20"> ERC20_Purchases 
                            </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        
                        
                        {/* <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link> */}
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </div>
    )

}

export default Navigation;