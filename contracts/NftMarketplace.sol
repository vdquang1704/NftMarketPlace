// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NotOwner();
error AlreadyListed(address nftAddress, uint256 tokenId);
error NotListedERC721(address nftAddress, uint256 tokenId);
error NotListedERC1155(uint256 listingId);
error NotListedERC20(address tokenAddress);

contract NftMarketplace is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _listingIds;
    uint256 public tokenERC20Sold;
    uint256 public tokenERC20Listing;

    struct ListingERC1155 {
        address nftAddress;
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        uint256 tokenAvailable;
        bool soldOut;
    }

    struct ListingERC721 {
        uint256 price;
        address seller;
    }

    struct ListingERC20 {
        uint256 price;
        address seller;
        uint256 amount;
    }

    mapping(uint256 => ListingERC1155) private ERC1155List;
    mapping(address => mapping(uint256 => ListingERC721)) private ERC721List;
    mapping(address => ListingERC20) private ERC20List;
    mapping(address => uint256) private ERC721Proceeds;

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

    modifier isOwnerERC721(
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

    // modifier isOwnerERC20(address tokenAddress) {
    //     address owner = ERC20List[tokenAddress].seller;
    // }

    modifier isOwnerERC1155(uint256 listingId, address spender) {
        address owner = ERC1155List[listingId].seller;
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
        ListingERC721 memory listing = ERC721List[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListedERC721(address nftAddress, uint256 tokenId) {
        ListingERC721 memory listing = ERC721List[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListedERC721(nftAddress, tokenId);
        }
        _;
    }

    modifier isListedERC20(address tokenAddress) {
        ListingERC20 memory listing = ERC20List[tokenAddress];
        if (listing.price <= 0 || listing.amount <= 0) {
            revert NotListedERC20(tokenAddress);
        }
        _;
    }

    modifier isListedERC1155(uint256 listingId) {
        ListingERC1155 memory listing = ERC1155List[listingId];
        if (listing.price <= 0 || listing.amount <= 0) {
            revert NotListedERC1155(listingId);
        }
        _;
    }

    function listItemERC721(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isOwnerERC721(nftAddress, tokenId, msg.sender)
        notListed(nftAddress, tokenId, msg.sender)
    {
        require(price > 0, "Wrong Price !");
        IERC721 nft = IERC721(nftAddress);
        ERC721List[nftAddress][tokenId] = ListingERC721(price, msg.sender);

        emit ERC721Listed(nftAddress, msg.sender, tokenId, price);
    }

    function listItemERC1155(
        address nftAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    ) external {
        ERC1155 nft = ERC1155(nftAddress);
        _listingIds.increment();
        uint256 listingId = _listingIds.current();

        ERC1155List[listingId] = ListingERC1155(
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
    ) external {
        tokenERC20Listing += amount;
        ERC20List[tokenAddress] = ListingERC20(
            price,
            msg.sender,
            tokenERC20Listing
        );
        emit ERC20Listed(tokenAddress, msg.sender, price, tokenERC20Listing);
    }

    function buyItemERC721(address nftAddress, uint256 tokenId)
        external
        payable
        isListedERC721(nftAddress, tokenId)
    {
        ListingERC721 memory listedItem = ERC721List[nftAddress][tokenId];
        require(
            msg.value >= listedItem.price,
            "You don't have enough token to buy this Item"
        );
        ERC721Proceeds[listedItem.seller] += msg.value;
        delete (ERC721List[nftAddress][tokenId]);

        emit ERC721Sold(
            nftAddress,
            ERC721List[nftAddress][tokenId].seller,
            msg.sender,
            tokenId,
            ERC721List[nftAddress][tokenId].price
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
        ERC1155 nft = ERC1155(ERC1155List[listingId].nftAddress);
        require(
            msg.sender != ERC1155List[listingId].seller,
            "You can not buy this nft"
        );

        require(
            msg.value >= ERC1155List[listingId].price * amount,
            "You do not have enough token to buy this nft"
        );

        require(
            nft.balanceOf(
                ERC1155List[listingId].seller,
                ERC1155List[listingId].tokenId
            ) >= amount,
            "Seller does not have enough nfts"
        );

        require(
            ERC1155List[listingId].soldOut == false,
            "This nft is sold out"
        );
        require(
            ERC1155List[listingId].tokenAvailable >= amount,
            "Not enough nfts"
        );
        ERC1155List[listingId].tokenAvailable -= amount;
        if (ERC1155List[listingId].tokenAvailable == 0) {
            ERC1155List[listingId].soldOut = true;
        }

        emit ERC1155Sold(
            ERC1155List[listingId].nftAddress,
            ERC1155List[listingId].seller,
            msg.sender,
            ERC1155List[listingId].tokenId,
            amount,
            ERC1155List[listingId].price
        );

        nft.safeTransferFrom(
            ERC1155List[listingId].seller,
            msg.sender,
            ERC1155List[listingId].tokenId,
            amount,
            ""
        );

        payable(ERC1155List[listingId].seller).transfer(
            ERC1155List[listingId].price * amount
        );
    }

    function buyItemERC20(address tokenAddress, uint256 amount)
        external
        payable
    {
        ERC20 token = ERC20(tokenAddress);
        require(
            msg.value >= ((amount * ERC20List[tokenAddress].price)),
            "You don't have enough money"
        );
        tokenERC20Sold += amount;
        tokenERC20Listing -= amount;
        ERC20List[tokenAddress] = ListingERC20(
            ERC20List[tokenAddress].price,
            ERC20List[tokenAddress].seller,
            tokenERC20Listing
        );
        token.transferFrom(ERC20List[tokenAddress].seller, msg.sender, amount);

        payable(ERC20List[tokenAddress].seller).transfer(
            ERC20List[tokenAddress].price * amount
        );

        emit ERC20Sold(tokenAddress, msg.sender, tokenERC20Sold);
    }

    function updateListingERC721(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isOwnerERC721(nftAddress, tokenId, msg.sender)
        isListedERC721(nftAddress, tokenId)
    {
        ERC721List[nftAddress][tokenId].price = newPrice;
    }

    function updateListingERC1155(
        uint256 listingId,
        uint256 newPrice,
        uint256 newAmount
    )
        external
        isOwnerERC1155(listingId, msg.sender)
        isListedERC1155(listingId)
    {
        ERC1155List[listingId].price = newPrice;
        ERC1155List[listingId].amount = newAmount;
    }

    function updateListingERC20(
        address tokenAddress,
        uint256 newPrice,
        uint256 newAmount
    ) external isListedERC20(tokenAddress) {
        ERC20List[tokenAddress].price = newPrice;
        ERC20List[tokenAddress].amount = newAmount;
    }

    function getListingERC721(address nftAddress, uint256 tokenId)
        external
        view
        returns (ListingERC721 memory)
    {
        return ERC721List[nftAddress][tokenId];
    }

    function getListingERC1155(uint256 listingId)
        external
        view
        returns (ListingERC1155 memory)
    {
        return ERC1155List[listingId];
    }

    function getListingERC20(address tokenAddress)
        external
        view
        returns (ListingERC20 memory)
    {
        return ERC20List[tokenAddress];
    }

    // function getProceeds(address seller) external view returns (uint256) {
    //     return ERC721Proceeds[seller];
    // }

    function cancelListingERC721(address nftAddress, uint256 tokenId)
        external
        isOwnerERC721(nftAddress, tokenId, msg.sender)
        isListedERC721(nftAddress, tokenId)
    {
        delete (ERC721List[nftAddress][tokenId]);
    }

    function cancelListingERC1155(
        uint256 listingId,
        address nftAddress,
        uint256 tokenId
    )
        external
        isOwnerERC1155(listingId, msg.sender)
        isListedERC1155(listingId)
    {
        delete (ERC1155List[listingId]);
    }

    function cancelListingERC20(address tokenAddress)
        external
        isListedERC20(tokenAddress)
    {
        delete (ERC20List[tokenAddress]);
    }

    function withdrawProceeds() external {
        uint256 proceeds = ERC721Proceeds[msg.sender];
        require(proceeds > 0, "No Proceeds");
        ERC721Proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }
}
