// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error WrongPrice();
error NotOwner();
error NotApproved();
error Listed();
error NoProceeds();
error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);

contract NftMarketplace is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _listingIds;
    uint256 public tokenERC20Sold;
    uint256 public tokenERC20Listing;

    struct ListingERC20 {
        uint256 price;
        address seller;
        uint256 amount;
    }

    struct Listing {
        uint256 price;
        address seller;
    }

    struct ListingERC1155 {
        address nftAddress;
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        uint256 tokenAvailable;
        bool soldOut;
    }

    mapping(uint256 => ListingERC1155) private idToList;
    mapping(address => ListingERC20) private ERC20Listing;
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    event ERC1155Listed(
        address nftAddress,
        address seller,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    );

    event ERC721Listed(
        address nftAddress,
        address seller,
        uint256 tokenId,
        uint256 price
    );

    event ERC20Listed(
        address tokenAddress,
        address seller,
        uint256 price,
        uint256 amount
    );

    event ERC1155Sold(
        address nftAddress,
        address seller,
        address buyer,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    );

    event ERC721Sold(
        address nftAddress,
        address seller,
        address buyer,
        uint256 tokenId,
        uint256 price
    );

    event ERC20Sold(address tokenAddress, address buyer, uint256 amount);

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    function listItemERC721(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        notListed(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert WrongPrice();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApproved();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);

        emit ERC721Listed(nftAddress, msg.sender, tokenId, price);
    }

    function listItemERC1155(
        address nftAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    ) external onlyOwner {
        ERC1155 nft = ERC1155(nftAddress);
        _listingIds.increment();
        uint256 listingId = _listingIds.current();

        idToList[listingId] = ListingERC1155(
            nftAddress,
            msg.sender,
            tokenId,
            amount,
            price,
            amount,
            false
        );
        emit ERC1155Listed(nftAddress, msg.sender, tokenId, amount, price);
    }

    function listItemERC20(
        address tokenAddress,
        uint256 amount,
        uint256 price
    ) external onlyOwner {
        tokenERC20Listing += amount;
        ERC20Listing[tokenAddress] = ListingERC20(
            price / 100,
            msg.sender,
            tokenERC20Listing
        );
        emit ERC20Listed(
            tokenAddress,
            msg.sender,
            price / 100,
            tokenERC20Listing
        );
    }

    function buyItemERC721(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);

        emit ERC721Sold(
            nftAddress,
            s_listings[nftAddress][tokenId].seller,
            msg.sender,
            tokenId,
            s_listings[nftAddress][tokenId].price
        );

        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
    }

    function buyItemERC1155(uint256 listingId, uint256 amount)
        external
        payable
    {
        ERC1155 nft = ERC1155(idToList[listingId].nftAddress);
        require(
            msg.sender != idToList[listingId].seller,
            "You can't buy this nft"
        );

        require(
            msg.value >= idToList[listingId].price * amount,
            "You don't have enough token to buy this nft"
        );

        require(
            nft.balanceOf(
                idToList[listingId].seller,
                idToList[listingId].tokenId
            ) >= amount,
            "Seller doesn't have enough nfts"
        );

        require(idToList[listingId].soldOut == false, "This nft is sold out");
        require(
            idToList[listingId].tokenAvailable >= amount,
            "Not enough nfts"
        );
        idToList[listingId].tokenAvailable -= amount;
        if (idToList[listingId].tokenAvailable == 0) {
            idToList[listingId].soldOut = true;
        }

        emit ERC1155Sold(
            idToList[listingId].nftAddress,
            idToList[listingId].seller,
            msg.sender,
            idToList[listingId].tokenId,
            amount,
            idToList[listingId].price
        );

        nft.safeTransferFrom(
            idToList[listingId].seller,
            msg.sender,
            idToList[listingId].tokenId,
            amount,
            ""
        );

        payable(idToList[listingId].seller).transfer(
            idToList[listingId].price * amount
        );
    }

    function buyItemERC20(address tokenAddress, uint256 amount)
        external
        payable
    {
        ERC20 token = ERC20(tokenAddress);
        require(
            msg.value >= (amount * ERC20Listing[tokenAddress].price),
            "You don't have enough money"
        );
        tokenERC20Sold += amount;
        tokenERC20Listing -= amount;
        ERC20Listing[tokenAddress] = ListingERC20(
            ERC20Listing[tokenAddress].price,
            ERC20Listing[tokenAddress].seller,
            tokenERC20Listing
        );
        token.transferFrom(
            ERC20Listing[tokenAddress].seller,
            msg.sender,
            amount
        );

        payable(ERC20Listing[tokenAddress].seller).transfer(
            ERC20Listing[tokenAddress].price * amount
        );

        emit ERC20Sold(tokenAddress, msg.sender, tokenERC20Sold);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        s_listings[nftAddress][tokenId].price = newPrice;
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getListingERC20(address tokenAddress)
        external
        view
        returns (ListingERC20 memory)
    {
        return ERC20Listing[tokenAddress];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
    }
}
