# Alyra-Qaptur

Projet final de la formation Développeur Blockchain Alyra

## Livrable du projet

### Les smart contracts ont été déployés sur Mumbai (testnet Polygon)

- QapturState address: 0x090A444c30eb94832990657f84B8002Eb5535264 ([polygon scan](https://mumbai.polygonscan.com/address/0x090a444c30eb94832990657f84b8002eb5535264))
- QapturLandMarketplace address: 0xB0fbaA211EEFDf2996C733973f36cD7091c8f676 ([polygon scan](https://mumbai.polygonscan.com/address/0xb0fbaa211eefdf2996c733973f36cd7091c8f676))
- QapturProjectFactory address: 0x92f1dbdDE1b72CeA454256d55cD2E37a533C799F ([polygon scan](https://mumbai.polygonscan.com/address/0x92f1dbdde1b72cea454256d55cd2e37a533c799f))
- QapturProjectReward address: 0xFd1995D9B5723E07c45aDa8c412d8e5B1FC2ABAF ([polygon scan](https://mumbai.polygonscan.com/address/0xfd1995d9b5723e07c45ada8c412d8e5b1fc2abaf))

Les smart contracts utilisent le contrat USDC Aave qui est disponible à l'adresse suivante: 0xe9DcE89B076BA6107Bb64EF30678efec11939234 ([polygon scan](https://mumbai.polygonscan.com/address/0xe9dce89b076ba6107bb64ef30678efec11939234))

Le faucet pour les USDC de test est disponible à cette adresse: [https://staging.aave.com/faucet/?marketName=proto_mumbai_v3](https://staging.aave.com/faucet/?marketName=proto_mumbai_v3)

Le lien pour ajouter le token à votre MetaMask: [clic sur le portefeuille](https://staging.aave.com/reserve-overview/?underlyingAsset=0xe9dce89b076ba6107bb64ef30678efec11939234&marketName=proto_mumbai_v3)

### Dapp

La Dapp a été déployée sur Vercel à cette adresse: [https://qaptur.vercel.app/](https://qaptur.vercel.app/)

### Vidéo de démo de la Dapp

Vidéo de présentation des fonctionnalités de l'application décentralisée Qaptur (hébergée sur Loom).

[Présentation de la DApp Qaptur x Alyra - 10/04/2023](https://www.loom.com/share/b3b42498f4dc4a91a07d472a9f1cae34)

## Déploiement du projet

### Clone du repo

```bash
$ git clone git@github.com:0livierDAVID/Alyra-Qaptur.git
```

### Backend (blockchain)

#### Déploiement

```bash
# install dependencies
$ yarn install

# start local blockchain
$ yarn hardhat node

# deploy without test data: network added sepolia, goerli, mumbai
$ yarn hardhat run scripts/deploy-qaptur.js --network localhost

# deploy with test data: network added sepolia, goerli, mumbai
$ yarn hardhat run scripts/deploy-qaptur-data.js --network localhost
```

#### Autres commandes

```bash
# compile
$ yarn hardhat compile

# run tests
$ yarn hardhat test

# run tests with coverage info
$ yarn hardhat coverage
```

### Front

#### Déploiement

```bash
# install dependencies
$ yarn install

# launch dev server
$ yarn dev
```
