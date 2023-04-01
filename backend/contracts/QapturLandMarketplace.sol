// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC1155/IERC1155.sol";
import "./QapturState.sol";
import "./QapturLand.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/* TODO:
    - payable smart contract
    - if yes, withdraw possibility
    - address for project share
    - address for transaction fees
    - re-entrancy on buy functions?
    - safeMint?
*/

contract QapturLandMarketplace is Ownable {
    /** VARIABLES */
    QapturState stateContract;
    IERC20 erc20Stable;
    address projectWallet;

    struct OnSaleToken {
        address payable seller;
        uint amount;
        uint unitPrice;
    }
    OnSaleToken[] onSaleTokens;
    mapping(uint => OnSaleToken[]) public projectOnSaleTokens;

    /** EVENTS */
    event BoughtFromInitialSupply(address buyer, uint projectId, uint amount);
    event BoughtOnMarketplace(address seller, address buyer, uint projectId, uint amount);
    event ItemAddedToMarketplace(address seller, uint projectId, uint amount, uint price);
    event ItemRemoveFromMarketplace(address seller, uint projectId, uint amount);

    /** CONSTRUCTOR */
    constructor(address _stateContractAddr, address _erc20StableAddr, address _projectWallet) {
        stateContract = QapturState(_stateContractAddr);
        erc20Stable = IERC20(_erc20StableAddr);
        projectWallet = _projectWallet;
    }

    /** GETTER */
    function getProjectItemsOnSale(
        uint _projetId
    ) external view returns (OnSaleToken[] memory) {
        return projectOnSaleTokens[_projetId];
    }

    /** FUNCTIONS */
    function buyFromInitialSupply(
        uint _projectId,
        uint _tokenAmount
    ) external {
        (address qlandAddress,,uint totalSupply, uint availableSupply, uint price,) = stateContract.projects(_projectId);
        require( // check supply
            availableSupply >= _tokenAmount,
            "insufficient supply"
        );
        stateContract.updateSupply(_projectId, availableSupply - _tokenAmount);
        uint totalAmount = _tokenAmount * price * 1e6;
        require( // check allowance
            erc20Stable.allowance(msg.sender, address(this)) >= totalAmount,
            "insufficient allowance"
        );
        erc20Stable.transferFrom(msg.sender, projectWallet, totalAmount);
        QapturLand qland = QapturLand(qlandAddress);
        qland.mint(msg.sender, 0, _tokenAmount, '0x0');

        emit BoughtFromInitialSupply(msg.sender, _projectId, _tokenAmount);
    }

    function buyFromMarketplace(
        address _seller,
        uint _projectId,
        uint _tokenAmount,
        uint _amount
    ) external {
        // fee?
        // allowance
        // transferFrom
        emit BoughtOnMarketplace(_seller, msg.sender, _projectId, _tokenAmount);
    }

    function addItemToMarketplace(
        uint _projectId,
        uint _tokenAmount,
        uint _amount,
        uint _tokenPrice
    ) external {
        emit ItemAddedToMarketplace(msg.sender, _projectId, _tokenAmount, _tokenPrice);
    }

    function removeItemFromMarketplace(
        uint _projectId,
        uint _tokenAmount,
        uint _amount
    ) external {
        emit ItemRemoveFromMarketplace(msg.sender, _projectId, _tokenAmount);
    }
}
