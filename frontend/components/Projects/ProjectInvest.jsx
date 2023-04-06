import { useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  List,
  ListItem,
  Typography,
  CardActions,
  Button,
  FormControl,
} from "@mui/material";
import { formatUSDC } from "@/utils";

export default function ProjectInvest({
  supply,
  price,
  attributes: { annualCreditsExpected },
}) {
  const [nbShare, setNbShare] = useState();
  return (
    <Grid item xs={12} md={6}>
      <Card variant="outlined">
        <CardHeader
          title="Invest in this project"
          subheader="Invest now or you wille regret it soon!"
        />
        <CardContent>
          <FormControl fullWidth>
            <TextField
              placeholder="Set value"
              id="outlined-number"
              label="Number of shares"
              type="number"
              value={nbShare}
              onChange={(evt) => setNbShare(evt.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <List>
            <ListItem>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Available share: {supply}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Total price: {nbShare * formatUSDC(price) || 0} USDC
              </Typography>
            </ListItem>
            <ListItem>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Estimated yearly carbon credits emission:{" "}
                {annualCreditsExpected}
              </Typography>
            </ListItem>
          </List>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "end" }}>
          <Button variant="contained">Invest</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
