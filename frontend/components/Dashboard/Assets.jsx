import { useState } from "react";
import { Paper, Typography, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import TabProjects from "./TabProjects";
import TabCarbonCredits from "./TabCarbonCredits";
import TabTransactions from "./TabTransactions";
import TabArchive from "./TabArchive";

export default function Assets() {
  const [activeTab, setActiveTab] = useState("0");
  const handleChange = (evt, newVal) => {
    setActiveTab(newVal);
  };
  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" component="h2">
        My assets
      </Typography>
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="assets tabs">
            <Tab label="Projects" value="0" />
            <Tab label="Carbon credits" value="1" />
            <Tab label="Archive" value="2" />
            <Tab label="Transactions" value="3" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <TabProjects />
        </TabPanel>
        <TabPanel value="1">
          <TabCarbonCredits />
        </TabPanel>
        <TabPanel value="2">
          <TabArchive />
        </TabPanel>
        <TabPanel value="3">
          <TabTransactions />
        </TabPanel>
      </TabContext>
    </Paper>
  );
}
