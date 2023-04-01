// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./QapturLand.sol";
import "./QapturCo2.sol";
import "./QapturState.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/** TODO: 
    - add QC02 import and contract deployement
*/

contract QapturProjectFactory is Ownable {
    // Variable
    QapturState stateContract;
    address qlandMarketplaceAddress;
    address qco2MarketplaceAddress;

    // Events
    event ProjectCollectionsCreated(string name, uint timestamp);

    // Constructor
    constructor(address _stateContractAddr) {
        stateContract = QapturState(_stateContractAddr);
    }

    // Deploy a new contract
    function createNewProject(
        string calldata _name,
        string calldata _uri,
        uint _maxSupply,
        uint _qlandPrice
    ) external onlyOwner {
        uint id = stateContract.getNewId();

        address addrQland = deployQlandSmartContract(_name, _uri);
        address addrCo2 = address(0);
        //address addrCo2 = deployQco2SmartContract(_name, _uri);

        stateContract.addProjectData(
            id,
            addrQland,
            addrCo2,
            _maxSupply,
            _qlandPrice
        );
        emit ProjectCollectionsCreated(_name, block.timestamp);
    }

    // Deploy a new qland smart contract
    function deployQlandSmartContract(
        string calldata _name,
        string calldata _uri
    ) internal returns (address) {
        if (qlandMarketplaceAddress == address(0)) {
            qlandMarketplaceAddress = stateContract
                .getQlandMarketplaceAddress();
        }
        require(
            qlandMarketplaceAddress != address(0),
            "Marketplace address is not configured"
        );
        bytes memory bytecode = type(QapturLand).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_name));
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(addr)) {
                // revert if something gone wrong
                revert(0, 0)
            }
        }
        QapturLand projectContract = QapturLand(addr);
        // Child contract init
        projectContract.init(_uri);
        // Give ownership to the marketplace
        projectContract.transferOwnership(qlandMarketplaceAddress);
        return (addr);
    }

    // Deploy a new qcO2 smart contract
    // function deployQco2SmartContract(
    //     string calldata _name,
    //     string calldata _uri
    // ) internal returns (address) {
    //     if (qco2MarketplaceAddress == address(0)) {
    //         qco2MarketplaceAddress = stateContract.getQco2MarketplaceAddress();
    //     }
    //     require(
    //         qco2MarketplaceAddress != address(0),
    //         "Marketplace address is not configured"
    //     );
    //     bytes memory bytecode = type(QapturCo2).creationCode;
    //     bytes32 salt = keccak256(abi.encodePacked(_name));
    //     address addr;
    //     assembly {
    //         addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
    //         if iszero(extcodesize(addr)) {
    //             // revert if something gone wrong
    //             revert(0, 0)
    //         }
    //     }
    //     QapturCo2 projectContract = QapturCo2(addr);
    //     // Child contract init
    //     projectContract.init(_uri);
    //     // Give ownership to the marketplace
    //     projectContract.transferOwnership(qco2MarketplaceAddress);
    //     return (addr);
    // }

}
