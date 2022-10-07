const NftMarketplace = artifacts.require("NftMarketplace.sol");
const ERC721_token = artifacts.require("ERC721_token.sol");
const ERC1155_token = artifacts.require("ERC1155_token.sol");
const ERC20_token = artifacts.require("ERC20_token");

module.exports = function (deployer) {
  deployer.deploy(NftMarketplace);
  // deployer.deploy(ERC721_token);
  // deployer.deploy(ERC1155_token);
  // deployer.deploy(ERC20_token);
};
