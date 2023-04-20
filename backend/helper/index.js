const { ethers, run } = require("hardhat");

const fs = require("fs");

const priceStableFormat = (amount) => ethers.utils.formatUnits(amount, 6);

const logPriceStable = (msg, amount) =>
  console.log(msg, priceStableFormat(amount), "USDC");

const exportContractData = (chainId, jsonContent) => {
  const fileName = "../frontend/contracts/contracts.json";
  const file = require(`../${fileName}`);
  // console.log(file);
  file[chainId] = jsonContent;
  // console.log(file);
  fs.writeFileSync(fileName, JSON.stringify(file, null, 2));
};

const verifyContract = async (contract, args, chainId) => {
  const { address } = contract;
  if (chainId === 31337) {
    return; // contract is deployed on local network or no apiKey is configured
  }
  console.log("Waiting 5 block confirmations...");
  await contract.deployTransaction.wait(5); // needed if verifyContract() is called immediately after deployment
  try {
    console.log("Verifying contract...");
    await run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (err) {
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    }
  }
};

module.exports = {
  priceStableFormat,
  logPriceStable,
  exportContractData,
  verifyContract,
};
