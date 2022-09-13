// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20_Token is ERC20 {
    address public admin;

    constructor() ERC20("VuDucQuang", "VDQ") {
        _mint(msg.sender, 100 * 10**18);
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "You can't mint the token");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        require(msg.sender == admin, "You can't burn the token");
        _burn(msg.sender, amount);
    }
}
