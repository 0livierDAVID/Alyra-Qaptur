import Image from "next/image";
import { Grid, List, ListItem, Typography, Chip, Avatar } from "@mui/material";

export default function ProjectSummary({
  name,
  image,
  supply,
  availableSupply,
  price,
  attributes,
}) {
  return (
    <>
      <Grid item xs={4}>
        <img
          src={image} // Route of the image file
          height={220} // Desired size with correct aspect ratio
          width={220} // Desired size with correct aspect ratio
          alt={name}
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <List>
          <ListItem>
            <Typography color="text.secondary">
              Country: {attributes?.country}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Type: {attributes?.type}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Estimated annual absorption: {attributes?.annualCreditsExpected}{" "}
              ton of CO2
            </Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Shares available:{" "}
              <Chip
                sx={{ fontWeight: "bold" }}
                label={`${availableSupply} / ${supply}`}
              />
            </Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Share unit price:{" "}
              <Chip
                sx={{ fontWeight: "bold" }}
                label={`${price} USDC`}
                avatar={<Avatar alt="USDC logo" src="/images/usdc.svg" />}
              />
            </Typography>
          </ListItem>
        </List>
      </Grid>
    </>
  );
}
