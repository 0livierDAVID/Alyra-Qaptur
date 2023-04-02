// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./QapturProjectFactory.sol";
import "./QapturProjectReward.sol";
import "./QapturLandMarketplace.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/** TODO: 
    - optimize variable order and size (struct)
    - add QCO2 Marketplace
    - remove internal contract management?
*/

contract QapturState is Ownable {
    // Contracts
    QapturProjectFactory factoryContract;
    QapturProjectReward rewardContract;
    QapturLandMarketplace qlandMarketplaceContract;
    // QapturCo2Marketplace qlandMarketplaceContract;

    // Projects, address, max supply
    struct QapturProject {
        address qlandAddr;
        address qco2Addr;
        uint totalSupply;
        uint availableSupply;
        uint price;
        uint lastDistribution; //year
    }
    mapping(address => bool) _contracts;
    mapping(uint => QapturProject) public projects;

    uint projectId;

    // Modifier
    modifier requireFactory() {
        require(
            address(factoryContract) != address(0),
            "factory contract unavailable"
        );
        _;
    }
    modifier isInternalContract() {
        require(_contracts[msg.sender], "Access denied");
        _;
    }

    // Events
    // event config
    event ContractAdressUpdated(string name, address contractAddress); // several events by contract type
    event NewProjectDeployed(
        uint _id,
        address qlandAddress,
        address qco2Address,
        uint qlandMaxSupply,
        uint qlandPrice
    );

    /*** CONFIGURATION onlyOwner ***/
    function setFactoryAddress(address _contractAddr) external onlyOwner {
        require(_contractAddr != address(0), "Address should be defined");
        factoryContract = QapturProjectFactory(_contractAddr);
        _contracts[_contractAddr] = true;
        emit ContractAdressUpdated("Factory", _contractAddr);
    }

    function setRewardAddress(address _contractAddr) external onlyOwner {
        require(_contractAddr != address(0), "Address should be defined");
        rewardContract = QapturProjectReward(_contractAddr);
        _contracts[_contractAddr] = true;
        emit ContractAdressUpdated("Reward", _contractAddr);
    }

    function setQlandMarketplaceAddress(
        address _contractAddr
    ) external onlyOwner {
        require(_contractAddr != address(0), "Address should be defined");
        qlandMarketplaceContract = QapturLandMarketplace(_contractAddr);
        _contracts[_contractAddr] = true;
        emit ContractAdressUpdated("QLAND marketplace", _contractAddr);
    }

    // function setQco2MarketplaceAddress(
    //     address _contractAddr
    // ) external onlyOwner {
    //     require(_contractAddr != address(0), "Address should be defined");
    //     qco2MarketplaceContract = QapturCo2Marketplace(_contractAddr);
    //     _contracts[_contractAddr] = true;
    //     ContractAdressUpdated("QCO2 marketplace", _contractAddr);
    // }

    function getQlandMarketplaceAddress()
        external
        view
        isInternalContract
        returns (address)
    {
        return address(qlandMarketplaceContract);
    }

    // function getQco2MarketplaceAddress()
    //     external view
    //     isInternalContract
    //     returns (address)
    // {
    //     return address(qco2MarketplaceContract);
    // }

    /*** ------------------------- ***/

    /*** PROJECT ***/
    function getNewId() external returns (uint) {
        return ++projectId;
    }

    function addProjectData(
        uint _id,
        address _qlandAddr,
        address _qco2Addr,
        uint _qlandTotalSupply,
        uint _qlandPrice
    ) external isInternalContract {
        console.log("AddProjectData", _qlandAddr);
        projects[_id] = QapturProject(
            _qlandAddr,
            _qco2Addr,
            _qlandTotalSupply,
            _qlandTotalSupply,
            _qlandPrice,
            0
        );
        emit NewProjectDeployed(
            _id,
            _qlandAddr,
            _qco2Addr,
            _qlandTotalSupply,
            _qlandPrice
        );
    }

    function getAvailableSupply(uint _projectId) external view returns (uint) {
        return projects[_projectId].availableSupply;
    }

    function updateSupply(
        uint _projectId,
        uint _newValue
    ) external isInternalContract {
        projects[_projectId].availableSupply = _newValue;
    }
}
