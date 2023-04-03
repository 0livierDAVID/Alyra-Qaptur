import { useState } from "react";
import axios from "axios";
import { Inter } from "next/font/google";
import {
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Button,
} from "@mui/material";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function ProjectAddition() {
  const [projectId, setProjectId] = useState("");
  const [imgFile, setImgFile] = useState("");

  const onProjectIdChange = (evt) => {
    setImgFile(evt.target.files[0]);
  };

  const onFileChange = (evt) => {
    setImgFile(evt.target.files[0]); //file object
  };

  const checkAuth = async () => {
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
      // console.log(resFile);
      console.log(resFile.data.message);
    } catch (error) {
      console.log("Auth to IPFS: ");
      console.log(error);
    }
  };

  const uploadImage = async () => {
    if (imgFile) {
      try {
        const myfieldvalue = "zut";
        const formData = new FormData();
        formData.append("file", imgFile);
        const metadata = JSON.stringify({
          name: "file name",
          keyvalues: {
            altname: "MickeyMouse",
            description: "A famous mouse",
            customKey: myfieldvalue,
            customKey2: "customValue2",
          },
        });
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
        // console.log(resFile);
        console.log("IpfsHash:", resFile.data.IpfsHash);
        console.log("PinSize:", resFile.data.PinSize);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };

  const uploadMetadata = async () => {
    try {
      const myfieldvalue = "prout";
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: "testing",
          keyvalues: {
            customKey: myfieldvalue,
            customKey2: "customValue2",
          },
        },
        pinataContent: {
          somekey: myfieldvalue,
          hello: "Good",
          Ola: "Nice",
        },
      });

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(resFile);
      console.log("IpfsHash:", resFile.data.IpfsHash);
      console.log("PinSize:", resFile.data.PinSize);
    } catch (error) {
      console.log("Error sending File to IPFS: ");
      console.log(error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" component="h1">
        Deploy a new project
      </Typography>
      <Paper sx={{ mb: 2, p: 2 }}>
        <h3>Step 0: Check IPFS authentication</h3>
        <Button onClick={checkAuth} variant="contained">
          Check
        </Button>
      </Paper>
      <Paper sx={{ mb: 2, p: 2 }}>
        <h3>Step 1: Select a project in the list</h3>
        <p>
          New project data are stored in a JavaScript file for the purpose of
          the demo. In the reality, they will be available in a database.
        </p>
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
              onChange={onProjectIdChange}
            >
              <MenuItem value={1}>Project 1</MenuItem>
              <MenuItem value={2}>Project 2</MenuItem>
              <MenuItem value={3}>Project 3</MenuItem>
            </Select>
          </FormControl>
        </form>
      </Paper>
      <Paper sx={{ mb: 2, p: 2 }}>
        <h3>Step 2: Upload image</h3>
        <form
          encType="multipart/form-data"
          onSubmit={() => {
            sendFileToIPFS;
          }}
        >
          <Input onChange={onFileChange} type="file" />
          <Button onClick={uploadImage} variant="contained">
            Upload
          </Button>
        </form>
      </Paper>
      <Paper sx={{ mb: 2, p: 2 }}>
        <h3>
          Step 3: Generate and upload metadata and create project&apos;s
          smart-contracts
        </h3>
        <Button onClick={uploadMetadata} variant="contained">
          Create project
        </Button>
      </Paper>
    </Layout>
  );
}
