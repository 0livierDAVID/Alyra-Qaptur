// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./QapturLandProject.sol";
import "./QapturLandState.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/// @title QapturLand project factory
/// @author Olivier David - o.david@yahoo.fr
/// @notice
/// @dev Replaceable
/// @custom:experimental This is an experimental contract.
contract QapturLandProjectFactory is Ownable {
    // Events
    event ProjectCollectionCreated(
        string name,
        address collectionAdress,
        uint timestamp
    );

    /* Admins list */
    mapping(address => bool) private _admins;

    // Modifier
    modifier onlyAdmin() {
        require(_admins[msg.sender], "Access restricted to admins");
        _;
    }

    // Constructor

    // Deploy a new contract
    function newContrat(
        string calldata _name,
        string calldata _uri
    ) external onlyAdmin returns (address) {
        bytes memory bytecode = type(QapturLandProject).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_name));

        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)

            if iszero(extcodesize(addr)) {
                // revert if something gone wrong
                revert(0, 0)
            }
        }
        QapturLandProject projectContract = QapturLandProject(addr);
        // Child contract init 
        projectContract.init(_uri);

        // Give ownership to initial contracts deployer 
        projectContract.transferOwnership(owner());

        emit ProjectCollectionCreated(_name, addr, block.timestamp);
        console.log("ProjectCollectionCreated:", _name, addr, block.timestamp);

        QapturLandState(msg.sender).storeProject(addr);

        return (addr);
    }

    /* Admins address list update */
    function addAdmin(address _admin) external onlyOwner {
        _admins[_admin] = true;
    }

    function removeAdmin(address _admin) external onlyOwner {
        _admins[_admin] = false;
    }
    /* ------------------ */
}
