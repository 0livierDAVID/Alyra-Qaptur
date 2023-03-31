// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./QapturLandProjectFactory.sol";
import "./QapturLandProject.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

/** TODO: 
    - remove template? add calculate reward & QapturCO2Base
    - optimize variable order and size (struct)
    -
    -
    -
*/

/// @title QapturLand token base smart contract
/// @author Olivier David - o.david@yahoo.fr
/// @notice
/// @dev /!\ Not replaceable
/// @custom:experimental This is an experimental contract.

contract QapturLandState is Ownable {
    // Contracts
    QapturLandProjectFactory factoryContract;

    // Projects, address, max supply
    struct QlandProject {
        string name;
        address qlandAddr;
        address qco2Addr;
        uint qlandSupply;
    }
    //QlandProject[] public QlandProjectArray;
    mapping(address => bool) _contracts;
    mapping(uint => QlandProject) _projects;

    uint nbProjects;

    // Modifier
    modifier requireContractAdresses() {
        require(
            address(factoryContract) != address(0),
            "factory contract unavailable"
        );
        // require(
        //     address(templateContract) != address(0),
        //     "template contract unavailable"
        // );
        _;
    }
    modifier isInternalContract() {
        require(_contracts[msg.sender], "Access denied");
        _;
    }

    // Events
    // event config
    event ContractAdressesUpdated(string name, address contractAddress); // several events by contract type
    event NewProjectDeployed(
        string name,
        address qlandAddress,
        address qco2Address
    ); // max supply?

    // Constructor
    // constructor() {}

    /*** CONFIGURATION onlyOwner ***/
    function setContractAddresses(
        address _factoryContract,
        address _templateContract
    ) external onlyOwner {
        require(_factoryContract != address(0), "Adress should be defined");
        // require != address(0)
        // templateContract = QapturLandProjectTemplate(_templateContract);
        factoryContract = QapturLandProjectFactory(_factoryContract);
        _contracts[_factoryContract] = true;

        // event ? events ?
    }

    /*** ------------------------- ***/

    /*** PROJECT FACTORY onlyOwner ***/
    function createNewProject(
        string calldata _name,
        string calldata _uri
    ) external onlyOwner requireContractAdresses returns (address) {
        nbProjects++;
        address _addr = factoryContract.newContrat(_name, _uri);
        // event
        // create qco2 smart contract ?
        // add project to local storage
        _projects[nbProjects] = QlandProject(
            _name,
            _addr,
            address(0),
            10 //supply to add
        );
        // event
        emit NewProjectDeployed(_name, _addr, address(0));
        return _addr;
    }

    function storeProject(
        address _addr
    ) external requireContractAdresses isInternalContract {
        console.log("coucou depuis ici", _addr);
    }

    function getProjectAddress(
        uint _projectId
    ) external requireContractAdresses returns (address) {
        return _projects[_projectId].qlandAddr;
    }

    /*** --------------- ***/

    /*** PROJECT COLLECTIONS ***/

    // mint token for a project // max supply
    // no tokenId for QLAND just for batch actions
    function mintQland(
        uint _projectId,
        address _account,
        uint256 _amount
    ) external onlyOwner requireContractAdresses {
        QapturLandProject qlandContract = QapturLandProject(
            _projects[_projectId].qlandAddr
        );
        // no tokenId for QLAND just for batch action
        qlandContract.mint(_account, 0, _amount, "0x00");
    }

    // getter project infos

    // transfer direct depuis smart contract

    /*** ------------------- ***/
}
