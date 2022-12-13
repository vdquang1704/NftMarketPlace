// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721_Token is ERC721 {
    uint256 public tokenCounter;

    event PugMinted(uint256 indexed tokenId);

    constructor() ERC721("DogCoin", "PUG") {
        tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, tokenCounter);
        emit PugMinted(tokenCounter);
        tokenCounter = tokenCounter + 1;
    }

    function getTokenCounter() public view returns (uint256) {
        return tokenCounter;
    }
}
