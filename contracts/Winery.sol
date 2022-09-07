// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Winery NFT Smart Contract
/// @author Aubrey Graham
/// @notice Mints a wine image as an NFT and puts it up for sale
/// @dev A smart contract for uploading, minting, selling, buying and gifting NFTs

contract Winery is ERC721, ERC721Enumerable, ERC721URIStorage {
    constructor() ERC721("Winery", "WNFT") {}

    // string private uri = "https://ipfs.io/ipfs/QmSw9o2dDbGSK8BGHB1yYZDCzBfAjKtv5DFebQadJUZb85/";

    using Counters for Counters.Counter;

    Counters.Counter private wineCount;

    struct Wine {
        address payable owner;
        uint256 winePrice;
        bool wineSold;
    }

    mapping(uint256 => Wine) private wines;

    modifier exist(uint _index) {
        require(_exists(_index), "Query of nonexistent wine");
        _;
    }

    /// @notice Requests for wine details like name, description, price and stores these details
    /// @dev Takes the params as arguments and stores them in a wine mapping using the index as a key and mint a wine image as an NFT
    /// @param _uri, url of the wine to be uploaded
    /// @param _winePrice, price of the wine to be uploaded
    function addWine(string calldata _uri, uint256 _winePrice) external {
        require(_winePrice > 0, "Price must be at least 1");
        require(bytes(_uri).length > 0, "Invalid uri used");
        uint256 _wineId = wineCount.current(); // initializing the token ID to the current wineCount
        wineCount.increment();
        bool _wineSold = false;

        wines[_wineId] = Wine(payable(msg.sender), _winePrice, _wineSold);

        // minting the jersey as soon as it is uploaded by calling the safeMint function
        _safeMint(msg.sender, _wineId);
        _setTokenURI(_wineId, _uri);
    }

    /// @notice Buy the desired NFT with a specified price
    /// @dev Uses the index of the stored wine to purchase a wine
    ///     requires that the following conditions are true
    ///     1. that the price is valid
    ///     2. that the buyer is not the seller
    ///     3. that the particular id requested is valid
    ///     4. that the item requested has not been sold
    ///    if valid, it transfers the NFT to the buyer, sends the wine price to the seller
    ///    and changes the owner of the NFT to the buyer
    /// @param _index, the index of the requested product to be bought
    function buyWine(uint256 _index) external payable exist(_index) {
        uint256 _winePrice = wines[_index].winePrice; //assigning the NFT winePrice to a variable
        bool _wineSold = wines[_index].wineSold; // assign the wineSold value to a local variable

        require(!_wineSold, "Wine already sold"); // check if the wine has already been sold
        require(
            msg.value == _winePrice,
            "Please submit the asking wine price in order to complete the purchase"
        ); // winePrice of the NFT must be met
        require(
            msg.sender != wines[_index].owner,
            "Sorry, you can't buy your minted wine"
        ); // the buyer must not be the owner

        address _owner = wines[_index].owner;

        wines[_index].owner = payable(msg.sender); //changing the owner variable of the NFT to the buyer
        wines[_index].wineSold = true;

        _transfer(_owner, msg.sender, _index); //transfering ownership of the NFT to the buyer
        (bool success, ) = payable(_owner).call{value: msg.value}("");
        require(success, "Failed to transfer payment to seller"); //tranfering money to the seller of the NFT
    }

    /// @notice Get wine, to get a particular wine from the wines stored using its index
    /// @dev Uses the index as a param to get the wine stored in the wines mapping with that particular index as key
    /// @param _index, index of the wine corresponding to the key in the mapping
    /// @return wine, with all the details it has been stored with
    function getWine(uint256 _index)
        external
        view
        exist(_index)
        returns (
            address payable,
            uint256,
            bool
        )
    {
        return (
            wines[_index].owner,
            wines[_index].winePrice,
            wines[_index].wineSold
        );
    }

    /// @notice allow wines' owners to gift their wines
    /// @dev Takes in the param wineId to find the wine with stored with that particular Id
    ///     uses the safeTransferFrom function to transfer the NFT from the owner to the receiver
    ///     the receiver become the new owner ofn the NFT
    /// @param _wineId, id of the wine to be gifted
    /// @param _receiver, the address of the receiver of the wine gift
    function giftWine(uint256 _wineId, address _receiver)
        external
        exist(_wineId)
    {
        require(
            _receiver != address(0),
            "Error: Address zero is not a valid receiver"
        );
        require(
            msg.sender == wines[_wineId].owner,
            "Sorry, only wine owner can gift wine"
        );
        require(
            msg.sender != _receiver,
            "Sorry, but you can't gift yourself your wine"
        );

        wines[_wineId].owner = payable(_receiver);
        _safeTransfer(msg.sender, _receiver, _wineId, "");
    }

    /// @notice Gets the total number of NFT stored
    /// @dev Gets the value of the global variable length indicates the number of NFTs stored in the wines mapping
    /// @return length, the current value of the global variable length
    function getWineLength() external view returns (uint256) {
        return wineCount.current();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-transferFrom}.
     * Changes is made to transferFrom to make state changes for wine in the mapping wines
     */
    function transferFrom(
        address from,
        address to,
        uint256 _tokenId
    ) public override {
        wines[_tokenId].owner = payable(to);
        wines[_tokenId].wineSold = true;
        super.transferFrom(from, to, _tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     * Changes is made to safeTransferFrom to make state changes for wine in the mapping wines
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 _tokenId,
        bytes memory data
    ) public override {
        wines[_tokenId].owner = payable(to);
        wines[_tokenId].wineSold = true;
        _safeTransfer(from, to, _tokenId, data);
    }
}
