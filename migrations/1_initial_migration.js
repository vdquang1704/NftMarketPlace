const NftMarketplace = artifacts.require("NftMarketplace.sol");
const firstNft = artifacts.require("firstNft.sol");
const secondNft = artifacts.require("secondNft.sol");

module.exports = function(deployer) {
    deployer.deploy(NftMarketplace);
    deployer.deploy(firstNft);
    deployer.deploy(secondNft);
}