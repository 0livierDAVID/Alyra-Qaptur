import Image from "next/image";
import { Grid, List, ListItem, Typography } from "@mui/material";
import { formatUSDC } from "@/utils";

export default function ProjectSummary({
  name,
  image,
  supply,
  price,
  attributes: { country, type, annualCreditsExpected },
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
            <Typography color="text.secondary">Country: {country}</Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">Type: {type}</Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Estimated annual absorption: {annualCreditsExpected} ton of CO2
            </Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">Shares: {supply}</Typography>
          </ListItem>
          <ListItem>
            <Typography color="text.secondary">
              Share unit price: {formatUSDC(price)} USDC
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
