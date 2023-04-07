// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./ERC1155/ERC1155.sol";
import "./ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/* TODO:
    - add fees collection
    - add tracking for reward calculation
*/
contract QapturLand is ERC1155, Ownable, ERC1155Burnable {

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }
}
