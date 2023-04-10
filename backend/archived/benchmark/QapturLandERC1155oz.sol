// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "../../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract QapturLandERC1155oz is ERC1155, Ownable {
    constructor() ERC1155("QapturLandTest") {}

    function mint(
        address account,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 id,
    //     uint256 amount
    // ) public onlyOwner {
    //     safeTransferFrom(from, to, id, amount, "");
    // }
}
