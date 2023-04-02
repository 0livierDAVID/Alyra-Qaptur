import Image from "next/image";
import { Grid, List, ListItem, Typography } from "@mui/material";

export default function ProjectSummary() {
  return (
    <>
      <Grid item xs={4}>
        <Image
          src="/images/projects/project-1.png" // Route of the image file
          height={220} // Desired size with correct aspect ratio
          width={220} // Desired size with correct aspect ratio
          alt="Project name"
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <List>
          <ListItem>
            <Typography color="text.secondary">Country:</Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">Type:</Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Estimated absorption (ton of CO2):
            </Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">Shares:</Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">Share unit price:</Typography>
          </ListItem>
        </List>
        {/* <List dense={dense}>
          {generate(
            <ListItem>
              <ListItemText
                primary="Single-line item"
              />
            </ListItem>
          )}
        </List> */}
      </Grid>
    </>
  );
}
