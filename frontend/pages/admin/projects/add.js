import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { useSigner } from "wagmi";
import { Inter } from "next/font/google";
import {
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Input,
  Button,
  Alert,
} from "@mui/material";
import { useContracts } from "@/context/contractsContext";
import Layout from "@/components/Layout";
import projects from "@/data/data";
import useContractsAvailable from "@/hooks/useContractsAvailable";
import {
  getIpfsUrl,
  prepareImageMetadata,
  prepareProjectMetadata,
  toMwei,
} from "@/utils";

const inter = Inter({ subsets: ["latin"] });

export default function ProjectAddition() {
  const contractsAvailable = useContractsAvailable();
  const { factory } = useContracts();
  const { data: signer } = useSigner();

  const [notif0, setNotif0] = useState(null);
  const [notif1, setNotif1] = useState(null);
  const [notif2, setNotif2] = useState(null);
  const [notif3, setNotif3] = useState(null);

  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState({});

  const [imgFile, setImgFile] = useState("");
  const [imgHash, setImgHash] = useState("");

  const [supply, setSupply] = useState("");
  const [price, setPrice] = useState("");

  const checkAuth = async () => {
    setNotif1(null);
    try {
      const formData = new FormData();
      formData.append("file", imgFile);

      // Check auth on API
      const resFile = await axios({
        method: "get",
        url: "https://api.pinata.cloud/data/testAuthentication",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      });
      setNotif0({ type: "success", msg: resFile.data.message });
    } catch (error) {
      setNotif0({ type: "error", msg: `Auth to IPFS: ${error}` });
    }
  };

  const selectProjectData = async (evt) => {
    const jsonId = Number(evt.target.value) - 1;
    setProjectId(evt.target.value);
    setProjectData(projects[jsonId]);
    setNotif1({
      type: "success",
      msg: `Project ${evt.target.value} data loaded`,
    });
  };

  const uploadImage = async () => {
    if (imgFile) {
      setNotif2(null);
      try {
        const formData = new FormData();
        formData.append("file", imgFile);

        const metadata = prepareImageMetadata(projectData);
        formData.append("pinataMetadata", metadata);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setImgHash(resFile.data.IpfsHash);
        setNotif2({
          type: "success",
          msg: `IpfsHash: ${resFile.data.IpfsHash} | PinSize: ${resFile.data.PinSize}`,
        });
      } catch (error) {
        setNotif2({
          type: "error",
          msg: `Error sending File to IPFS: ${error}`,
        });
      }
    }
  };

  const uploadMetadata = async () => {
    setNotif3(null);
    try {
      const data = prepareProjectMetadata(projectData, imgHash);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      });
      const ipfsHash = resFile.data.IpfsHash;
      console.log(ipfsHash);
      if (ipfsHash === "") {
        setNotif3({
          type: "error",
          msg: `The file loading on IPFS failed`,
        });
        return;
      }
      createProjectSC(ipfsHash);
    } catch (error) {
      setNotif3({
        type: "error",
        msg: `Error sending File to IPFS: ${error}`,
      });
    }
  };

  const createProjectSC = async (fileHash) => {
    if (!contractsAvailable) return;
    try {
      const parameters = [
        projectData.name, // name
        getIpfsUrl(fileHash), // json data on IPFS
        BigNumber.from(supply), // max supply
        BigNumber.from(toMwei(price)), // project share price
      ];
      const contract = new ethers.Contract(
        factory.address,
        factory.abi,
        signer
      );
      const transaction = await contract.createNewProject(...parameters);
      transaction.wait();
      // console.log(transaction);

      // transaction hash
      // smart contracts
      setNotif3({
        type: "success",
        msg: `IpfsHash: ${fileHash}  |\n transaction hash: ${transaction.hash}`,
      });
    } catch (error) {
      setNotif3({
        type: "error",
        msg: `Error during smart contracts creation. ${error}`,
      });
    }
  };

  return (
    <Layout>
      <Head>
        <title>New project deployement - Qaptur</title>
      </Head>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        Deploy a new project
      </Typography>
      {/* Step0 */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Step 0: Check IPFS authentication
        </Typography>
        <Button onClick={checkAuth} variant="contained">
          Check
        </Button>
        {notif0 && (
          <Alert sx={{ mt: 1 }} severity={notif0.type}>
            {notif0.msg}
          </Alert>
        )}
      </Paper>
      {/* Step1 */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Step 1: Select a project in the list
        </Typography>
        <Typography variant="body2" component="p" sx={{ mb: 2 }}>
          New project data are stored in a JavaScript file for the purpose of
          the demo. In the reality, they will be available in a database.
        </Typography>
        <form
          encType="multipart/form-data"
          onSubmit={() => {
            sendFileToIPFS;
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="project-select">Project</InputLabel>
            <Select
              labelId="project-select"
              id="project-select"
              value={projectId}
              label="Project"
              onChange={selectProjectData}
            >
              <MenuItem value={1}>Project 1</MenuItem>
              <MenuItem value={2}>Project 2</MenuItem>
              <MenuItem value={3}>Project 3</MenuItem>
            </Select>
          </FormControl>
        </form>
        {notif1 && (
          <Alert sx={{ mt: 1 }} severity={notif1.type}>
            {notif1.msg}
          </Alert>
        )}
      </Paper>
      {/* Step2 */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Step 2: Upload image
        </Typography>
        <form
          encType="multipart/form-data"
          onSubmit={() => {
            sendFileToIPFS;
          }}
        >
          <Input
            onChange={(evt) => setImgFile(evt.target.files[0])}
            type="file"
          />
          <Button onClick={uploadImage} variant="contained">
            Upload
          </Button>
        </form>
        {notif2 && (
          <Alert sx={{ mt: 1 }} severity={notif2.type}>
            {notif2.msg}
          </Alert>
        )}
      </Paper>
      {/* Step3 */}
      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Step 3: Generate and upload metadata and create project&apos;s
          smart-contracts
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            placeholder="Set value"
            id="outlined-number"
            label="Number of shares"
            type="number"
            value={supply}
            onChange={(evt) => setSupply(evt.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            placeholder="Set value"
            id="outlined-number"
            label="Share unit price"
            type="number"
            value={price}
            onChange={(evt) => setPrice(evt.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <Button onClick={uploadMetadata} variant="contained">
          Create project
        </Button>
        {notif3 && (
          <Alert sx={{ mt: 1 }} severity={notif3.type}>
            {notif3.msg}
          </Alert>
        )}
      </Paper>
    </Layout>
  );
}
