import { Box, Grid } from "@mui/material";
import TabProjectCard from "./helper/TabProjectCard";

export default function TabProjects() {
  return (
    <Box>
      <Grid container spacing={1}>
        <TabProjectCard />
        <TabProjectCard />
        <TabProjectCard />
      </Grid>
    </Box>
  );
}
