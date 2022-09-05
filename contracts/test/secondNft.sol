// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract secondNft is ERC721 {
    uint256 tokenCounter;

    event ShibaMinted(uint256 indexed tokenId);

    constructor() ERC721("DogCoin", "Shiba") {
        tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, tokenCounter);
        emit ShibaMinted(tokenCounter);
        tokenCounter = tokenCounter + 1;
    }

    function getTokenCounter() public view returns (uint256) {
        return tokenCounter;
    }
}
