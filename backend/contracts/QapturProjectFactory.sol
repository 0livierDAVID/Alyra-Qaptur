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
    - add function to update uri
*/

contract QapturProjectFactory is Ownable {
    // Variable
    QapturState stateContract;
    address qlandMarketplaceAddress;
    address qco2MarketplaceAddress;

    // Events
    event ProjectCollectionsCreated(address qland, address qco2, uint timestamp);

    // Constructor
    constructor(address _stateContractAddr, address _qlandMarketplaceAddress/*, address _qco2MarketplaceAddress*/) {
        stateContract = QapturState(_stateContractAddr);
        qlandMarketplaceAddress = _qlandMarketplaceAddress;
        // qco2MarketplaceAddress = _qco2MarketplaceAddress;
    }

    // Deploy a new contract
    function createNewProject(
        string calldata _name,
        string calldata _jsonUrl,
        uint _maxSupply,
        uint _qlandPrice
    ) external onlyOwner {
        address addrQland = deployQlandSmartContract(_name);
        address addrCo2 = address(0);
        //address addrCo2 = deployQco2SmartContract(_name);

        stateContract.addProjectData(
            addrQland,
            addrCo2,
            _maxSupply,
            _qlandPrice,
            _jsonUrl
        );
        emit ProjectCollectionsCreated(addrQland, addrCo2, block.timestamp);
    }

    // Deploy a new qland smart contract
    function deployQlandSmartContract(
        string calldata _name
    ) internal returns (address) {
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

        // Give ownership to the marketplace
        projectContract.transferOwnership(qlandMarketplaceAddress);
        return (addr);
    }

    // Deploy a new qcO2 smart contract
    // function deployQco2SmartContract(
    //     string calldata _name,
    // ) internal returns (address) {
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
    //     // Give ownership to the marketplace
    //     projectContract.transferOwnership(qco2MarketplaceAddress);
    //     return (addr);
    // }

}
