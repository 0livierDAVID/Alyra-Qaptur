import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { Inter } from "next/font/google";
import {
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import Layout from "@/components/Layout";
import StaticData from "@/components/Layout/helper/StaticData";

const inter = Inter({ subsets: ["latin"] });

export default function ProjectReward() {
  const [projectId, setProjectId] = useState("");

  const onProjectIdChange = (evt) => {
    setImgFile(evt.target.value);
  };

  const emitCarbonCredits = async (evt) => {
    evt.preventDefault();
    console.log("emit carbon credits");
    // try {
    //   const formData = new FormData();
    //   formData.append("file", imgFile);

    //   // Check auth on API
    //   const resFile = await axios({
    //     method: "get",
    //     url: "https://api.pinata.cloud/data/testAuthentication",
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    //     },
    //   });
    //   // console.log(resFile);
    //   console.log(resFile.data.message);
    // } catch (error) {
    //   console.log("Auth to IPFS: ");
    //   console.log(error);
    // }
  };
  return (
    <Layout>
      <StaticData />
      <Head>
        <title>Project carbon credits reward - Qaptur</title>
      </Head>
      <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
        Emit project carbon credits reward
      </Typography>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Typography variant="body2" component="p" sx={{ mb: 2 }}>
          Simplified version: carbon credits are calculated depending on a
          coefficient (t of CO2 per ha). Based on the current token holder at
          the date of the emission, the quantity is fixed on a pro rata basis
          regarding the total quantity.
        </Typography>
        <form encType="multipart/form-data" onSubmit={emitCarbonCredits}>
          <FormControl fullWidth sx={{ mb: 2 }}>
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              placeholder="Set value"
              id="coef-input"
              label="Coeffient"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Button type="submit" variant="contained">
            Emit
          </Button>
        </form>
      </Paper>
    </Layout>
  );
}
