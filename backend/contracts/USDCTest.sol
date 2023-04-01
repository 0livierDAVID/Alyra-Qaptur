// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDCTest is ERC20 {
    constructor() ERC20("Circle USD", "USDC") {
        _mint(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 10000 * 10 ** 6);
        _mint(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db, 10000 * 10 ** 6);
        _mint(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB, 10000 * 10 ** 6);
    }
}
