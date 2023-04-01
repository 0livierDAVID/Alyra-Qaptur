// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC1155/extensions/ERC1155Burnable.sol";
import "./ERC1155/extensions/ERC1155Supply.sol";

/* TODO:
    - remove unused extensions in 1155 folder
    - fee calculation? here or market place?
*/
contract QapturLand is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    bool initialized;

    modifier needInitialization() {
        require(!initialized, "Already initialized");
        _;
    }

    function init(string memory _newuri) external needInitialization {
        setURI(_newuri);
        initialized == true;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

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

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
