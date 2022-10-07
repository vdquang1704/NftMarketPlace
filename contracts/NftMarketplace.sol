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
error NotListedERC721(uint256 itemCount);
error NotListedERC1155(uint256 listingId);
error NotListedERC20(address tokenAddress);

contract NftMarketplace is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _listingIds;
    Counters.Counter public _listingERC20;

    uint256 public ERC721Count;
    uint256 public tokenERC20Sold;
    uint256 public tokenERC20Listing;

    // ListingERC20[] public sellerList;

    struct ListingERC1155 {
        uint256 itemId;
        address nftAddress;
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        uint256 tokenAvailable;
        bool soldOut;
    }

    struct ListingERC721 {
        uint256 itemId;
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        address seller;
    }

    struct ListingERC20 {
        uint256 itemId;
        address tokenAddress;
        uint256 price;
        address seller;
        uint256 amount;
    }

    mapping(uint256 => ListingERC1155) public ERC1155List;
    // mapping(address => mapping(uint256 => ListingERC721)) private ERC721List;
    mapping(uint256 => ListingERC721) public ERC721List;
    mapping(uint256 => ListingERC20) public ERC20List;
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
        address indexed nftAddress,
        address seller,
        address indexed buyer,
        uint256 tokenId,
        uint256 amount,
        uint256 price
    );

    event ERC721Sold(
        address indexed nftAddress,
        address indexed seller,
        address indexed buyer,
        uint256 tokenId,
        uint256 price
    );

    event ERC20Sold(
        address indexed tokenAddress,
        address indexed buyer,
        uint256 amount
    );

    modifier isOwnerERC721(uint256 itemCount, address spender) {
        address owner = ERC721List[itemCount].seller;
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier isOwnerERC1155(uint256 listingId, address spender) {
        address owner = ERC1155List[listingId].seller;
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier isOwnerERC20(uint256 listingERC20, address spender) {
        address owner = ERC20List[listingERC20].seller;
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier notListed(uint256 itemCount) {
        ListingERC721 memory listing = ERC721List[itemCount];
        if (listing.price > 0) {
            revert AlreadyListed(
                ERC721List[itemCount].nftAddress,
                ERC721List[itemCount].tokenId
            );
        }
        _;
    }

    modifier isListedERC721(uint256 itemCount) {
        ListingERC721 memory listing = ERC721List[itemCount];
        if (listing.price <= 0) {
            revert NotListedERC721(itemCount);
        }
        _;
    }

    modifier isListedERC20(uint256 listingERC20) {
        ListingERC20 memory listing = ERC20List[listingERC20];
        if (listing.price <= 0 || listing.amount <= 0) {
            revert NotListedERC20(ERC20List[listingERC20].tokenAddress);
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
    ) external {
        require(price > 0, "Wrong Price !");
        IERC721 nft = IERC721(nftAddress);
        ERC721Count++;
        ERC721List[ERC721Count] = ListingERC721(
            ERC721Count,
            nftAddress,
            tokenId,
            price,
            msg.sender
        );

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
            listingId,
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
        ERC20 token = ERC20(tokenAddress);
        _listingERC20.increment();
        uint256 listingERC20 = _listingERC20.current();
        tokenERC20Listing += amount;
        ERC20List[listingERC20] = ListingERC20(
            listingERC20,
            tokenAddress,
            price,
            msg.sender,
            amount
        );
        emit ERC20Listed(tokenAddress, msg.sender, price, tokenERC20Listing);
    }

    function buyItemERC721(uint256 itemCount)
        external
        payable
        isListedERC721(itemCount)
    {
        ListingERC721 memory listedItem = ERC721List[itemCount];
        require(itemCount <= ERC721Count, "This nft does not exist !");
        require(
            msg.value >= listedItem.price,
            "You don't have enough token to buy this Item"
        );
        ERC721Proceeds[listedItem.seller] += msg.value;
        emit ERC721Sold(
            ERC721List[itemCount].nftAddress,
            ERC721List[itemCount].seller,
            msg.sender,
            ERC721List[itemCount].tokenId,
            ERC721List[itemCount].price
        );
        delete (ERC721List[itemCount]);

        IERC721(listedItem.nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            listedItem.tokenId
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
            (ERC1155List[listingId].price)
        );
    }

    function buyItemERC20(uint256 listingERC20, uint256 amount)
        external
        payable
    {
        ERC20 token = ERC20(ERC20List[listingERC20].tokenAddress);
        require(
            msg.value >= (ERC20List[listingERC20].price),
            "You don't have enough money"
        );

        ERC20List[listingERC20].amount -= amount;

        token.transferFrom(ERC20List[listingERC20].seller, msg.sender, amount);

        payable(ERC20List[listingERC20].seller).transfer(
            (ERC20List[listingERC20].price)
        );

        emit ERC20Sold(
            ERC20List[listingERC20].tokenAddress,
            msg.sender,
            tokenERC20Sold
        );
    }

    function updateListingERC721(uint256 itemCount, uint256 newPrice)
        external
        isOwnerERC721(itemCount, msg.sender)
        isListedERC721(itemCount)
    {
        ERC721List[itemCount].price = newPrice;
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
        uint256 listingERC20,
        uint256 newPrice,
        uint256 newAmount
    )
        external
        isListedERC20(listingERC20)
        isOwnerERC20(listingERC20, msg.sender)
    {
        ERC20List[listingERC20].price = newPrice;
        ERC20List[listingERC20].amount = newAmount;
    }

    function getListingERC721(uint256 itemCount)
        external
        view
        returns (ListingERC721 memory)
    {
        return ERC721List[itemCount];
    }

    function getListingERC1155(uint256 listingId)
        external
        view
        returns (ListingERC1155 memory)
    {
        return ERC1155List[listingId];
    }

    function getListingERC20(uint256 listingERC20)
        external
        view
        returns (ListingERC20 memory)
    {
        return ERC20List[listingERC20];
    }

    function cancelListingERC721(uint256 itemCount)
        external
        isOwnerERC721(itemCount, msg.sender)
        isListedERC721(itemCount)
    {
        delete (ERC721List[itemCount]);
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

    function cancelListingERC20(uint256 listingERC20)
        external
        isOwnerERC20(listingERC20, msg.sender)
        isListedERC20(listingERC20)
    {
        delete (ERC20List[listingERC20]);
    }

    function withdrawProceeds() external {
        uint256 proceeds = ERC721Proceeds[msg.sender];
        require(proceeds > 0, "No Proceeds");
        ERC721Proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }
}
