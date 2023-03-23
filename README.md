# Alyra-Qaptur
Final project for Alyra

## TODO
### Back
* deploy: add doc gen & contract verification Etherscan
* 
### Front
* 
* 

## Back
### Hardhat init
```bash
$ yarn init

$ yarn add --dev hardhat

$ npx hardhat
# Create a JavaScript project
# add .gitignore
# add dependencies

$ yarn add hardhat-deploy @nomiclabs/hardhat-etherscan hardhat-gas-reporter solidity-coverage hardhat-docgen
```

### Dev commands
```bash
# compile
$ npx hardhat compile

# run tests
$ npx hardhat test

# deploy: network added sepolia, goerli, mumbai
$ npx hardhat run scripts/deploy.js --network sepolia

# hardhat node
$ npx hardhat node
```


## Back
### Front init
```bash
# NextJS
$ yarn create next-app .

# RainbowKit, WAGMI, Ethers
# /!\ change ethers version to "^5.7.2"
$ yarn add @rainbow-me/rainbowkit wagmi ethers

# Material UI
$ yarn add @mui/material @emotion/react @emotion/styled

```

### Dev commands
```bash
# compile
$ yarn dev
```