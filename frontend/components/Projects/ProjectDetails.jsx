import Image from "next/image";
import { Box, Grid, List, ListItem, Typography } from "@mui/material";

export default function ProjectDetails({
  description,
  attributes: {
    cobenefits,
    surface,
    afoluCategory,
    startDate,
    speciesPlanted,
    projectProponent,
    otherEntities,
    status,
    label,
    labelId,
    methodology,
    verifier,
  },
}) {
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
            {cobenefits.map((cobenefit) => (
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
          <Typography color="text.secondary">Surface: {surface} ha</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            AFOLU category: {afoluCategory}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Starting date: {startDate}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Trees species: {speciesPlanted}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Project leader: {projectProponent}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Other entities: {otherEntities}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Status: {status}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Label: {label}</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            projectId for label: {labelId}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Methodology: {methodology}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">
            Verificator: {verifier}
          </Typography>
        </ListItem>
      </List>
    </Grid>
  );
}
