// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./ERC1155/ERC1155.sol";
import "./ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/* TODO:
    - customize for QCO2 specific features
*/
contract QapturCo2 is ERC1155, Ownable, ERC1155Burnable {

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    // function mintBatch(
    //     address to,
    //     uint256[] memory ids,
    //     uint256[] memory amounts,
    //     bytes memory data
    // ) public onlyOwner {
    //     _mintBatch(to, ids, amounts, data);
    // }
}
