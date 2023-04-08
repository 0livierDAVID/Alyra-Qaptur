// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./QapturState.sol";
import "./QapturLand.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/* TODO:
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
        uint price;
    }
    OnSaleToken[] onSaleTokens;
    mapping(uint => OnSaleToken[]) public projectOnSaleTokens;

    /** EVENTS */
    event BoughtFromInitialSupply(address buyer, uint projectId, uint amount);
    event BoughtOnMarketplace(address seller, address buyer, uint projectId, uint amount);
    event ItemAddedToMarketplace(address seller, uint projectId, uint amount, uint price);
    //event ItemRemoveFromMarketplace(address seller, uint projectId, uint amount);

    /** CONSTRUCTOR */
    constructor(address _stateContractAddr, address _erc20StableAddr, address _projectWallet) {
        stateContract = QapturState(_stateContractAddr);
        erc20Stable = IERC20(_erc20StableAddr);
        projectWallet = _projectWallet;
    }

    /** GETTER, HELPER */
    function getProjectItemsOnSale(
        uint _projetId
    ) external view returns (OnSaleToken[] memory) {
        return projectOnSaleTokens[_projetId];
    }
    
    // retrieve index of a seller/price
    function findOnSaleTokenIndex(uint _projectId, address _seller, uint _price) internal view returns (uint) {
        for (uint i; i<projectOnSaleTokens[1].length; i++){
            if (projectOnSaleTokens[_projectId][i].seller == _seller 
            && projectOnSaleTokens[_projectId][i].price == _price){
                return i;
            }
        }
    }
    
    // update qty or remove index
    function updateOnSaleTokenQty(uint _projectId, uint _index, uint _qtyLeft) internal returns (uint) {
        if (_qtyLeft == 0){
            delete projectOnSaleTokens[_projectId][_index];
        } else {
            projectOnSaleTokens[_projectId][_index].amount = _qtyLeft;
        }
    }


    /** FUNCTIONS */
    function buyFromInitialSupply(
        uint _projectId,
        uint _tokenAmount
    ) external {
        (address qlandAddress,,uint totalSupply, uint availableSupply, uint price,,) = stateContract.projects(_projectId);
        require( // check supply
            availableSupply >= _tokenAmount,
            "insufficient supply"
        );
        stateContract.updateAvailableSupply(_projectId, availableSupply - _tokenAmount);
        uint totalPrice = _tokenAmount * price;
        require( // check allowance
            erc20Stable.allowance(msg.sender, address(this)) >= totalPrice,
            "insufficient allowance"
        );
        erc20Stable.transferFrom(msg.sender, projectWallet, totalPrice);
        QapturLand qland = QapturLand(qlandAddress);
        qland.mint(msg.sender, 0, _tokenAmount, '0x0');

        emit BoughtFromInitialSupply(msg.sender, _projectId, _tokenAmount);
    }

    function buyFromMarketplace(
        address _seller,
        uint _projectId,
        uint _tokenAmount,
        uint _price
    ) external {
        // TODO check seller balance
        (address qlandAddr,,,,,,) = stateContract.projects(_projectId);
        uint id = findOnSaleTokenIndex(_projectId, _seller, _price);
        uint amountOST = projectOnSaleTokens[_projectId][id].amount;
        require( // check qty available
            amountOST >= _tokenAmount,
            "requested quantity not available"
        );
        updateOnSaleTokenQty(_projectId, id, amountOST - _tokenAmount);
        uint totalPrice = _tokenAmount * _price;
        require( // check allowance
            erc20Stable.allowance(msg.sender, address(this)) >= totalPrice,
            "insufficient allowance"
        );
        erc20Stable.transferFrom(msg.sender, _seller, totalPrice);
        QapturLand qland = QapturLand(qlandAddr);
        require( // check approval
            qland.isApprovedForAll(_seller, address(this)),
            "missing approval"
        );
        qland.safeTransferFrom(_seller, msg.sender, 0, _tokenAmount, '0x0');
        emit BoughtOnMarketplace(_seller, msg.sender, _projectId, _tokenAmount);
    }

    function addItemToMarketplace(
        uint _projectId,
        uint _tokenAmount,
        uint _tokenPrice
    ) external {
        // TODO check balance
        // TODO check combination already exists?
        projectOnSaleTokens[_projectId].push(OnSaleToken(payable(msg.sender), _tokenAmount, _tokenPrice));
        emit ItemAddedToMarketplace(msg.sender, _projectId, _tokenAmount, _tokenPrice);
    }

    // function removeItemFromMarketplace(
    //     uint _projectId,
    //     uint _tokenAmount,
    // ) external {
    //     emit ItemRemoveFromMarketplace(msg.sender, _projectId, _tokenAmount);
    // }
}
