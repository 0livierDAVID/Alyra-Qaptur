// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDCTest is ERC20 {
    constructor() ERC20("Circle USD", "USDC") {
        _mint(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 10000 * 10 ** 6); //addr2 Remix
        _mint(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db, 10000 * 10 ** 6); //addr3 Remix
        _mint(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB, 10000 * 10 ** 6); //addr4 Remix

        _mint(0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 10000 * 10 ** 6); //addr1 Hardhat
        _mint(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC, 10000 * 10 ** 6); //addr2 Hardhat
        _mint(0x90F79bf6EB2c4f870365E785982E1f101E93b906, 10000 * 10 ** 6); //addr3 Hardhat
    }
}
