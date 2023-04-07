import Image from "next/image";
import { Grid, List, ListItem, Typography } from "@mui/material";
import { toUsdc } from "@/utils";

export default function ProjectSummary({
  name,
  image,
  supply,
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
            <Typography color="text.secondary">Shares: {supply}</Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Share unit price: {toUsdc(price)} USDC
            </Typography>
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
