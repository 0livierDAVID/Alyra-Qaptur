import Image from "next/image";
import { Box, Grid, List, ListItem, Typography } from "@mui/material";

export default function ProjectDetails({ description, attributes }) {
  return (
    <Grid item xs={12} md={6}>
      <Typography sx={{ ml: 2 }} color="text.secondary">
        Description:
      </Typography>
      <Typography sx={{ mb: 2, pr: 2 }} variant="body2" color="text.secondary">
        {description}
      </Typography>
      <List sx={{ mt: -2 }}>
        <ListItem>
          <Typography color="text.secondary">Co-benefits:</Typography>
          <Box sx={{ display: "flex", p: 1 }}>
            {attributes?.cobenefits.map((cobenefit) => (
              <Image
                key={cobenefit[0]}
                src={`/images/cobenefits/${cobenefit[0]}.png`}
                height={42}
                width={42}
                alt={cobenefit[1]}
              />
            ))}
          </Box>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Surface: {attributes?.surface} ha
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            AFOLU category: {attributes?.afoluCategory}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Starting date: {attributes?.startDate}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Trees species: {attributes?.speciesPlanted}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Project leader: {attributes?.projectProponent}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Other entities: {attributes?.otherEntities}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Status: {attributes?.status}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Label: {attributes?.label}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            projectId for label: {attributes?.labelId}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Methodology: {attributes?.methodology}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Verificator: {attributes?.verifier}
          </Typography>
        </ListItem>
      </List>
    </Grid>
  );
}
