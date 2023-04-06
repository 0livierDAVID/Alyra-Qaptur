import { ethers } from "ethers";

export const getIpfsUrl = (fileHash) => {
  return `https://ipfs.io/ipfs/${fileHash}`;
};

export const prepareImageMetadata = (projectData) => {
  //   console.log(projectData);
  const json = JSON.stringify(
    {
      name: `project-${projectData.id}.png`,
      keyvalues: {
        name: projectData.name,
        country: projectData.country,
      },
    },
    null,
    2
  );

  return json;
};

export const prepareProjectMetadata = (projectData, imgHash) => {
  const keys = ["id", "name", "description"];
  const attributes = {};
  for (const [key, value] of Object.entries(projectData)) {
    if (!keys.includes(key)) {
      attributes[key] = value;
    }
  }
  const json = JSON.stringify(
    {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: `project-${projectData.id}.json`,
        keyvalues: {
          name: projectData.name,
          country: projectData.country,
        },
      },
      pinataContent: {
        name: projectData.name,
        description: projectData.description,
        image: getIpfsUrl(imgHash),
        attributes: attributes,
      },
    },
    null,
    2
  );

  return json;
};

export const formatUSDC = (price) => {
  return Number(ethers.utils.formatUnits(price, "mwei"));
};
