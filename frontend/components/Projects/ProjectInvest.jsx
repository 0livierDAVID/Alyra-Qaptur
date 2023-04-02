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
} from "@mui/material";

export default function ProjectInvest() {
  return (
    <Grid item xs={12} md={6}>
      <Card variant="outlined">
        <CardHeader
          title="Invest in this project"
          subheader="Invest now or you wille regret it soon!"
        />
        <CardContent>
          <TextField
            sx={{ width: "100%" }}
            id="outlined-number"
            label="Number of shares"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <List>
            <ListItem>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Available share:
              </Typography>
            </ListItem>
            <ListItem>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Total price:
              </Typography>
            </ListItem>
            <ListItem>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Estimated yearly carbon credits emission:
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
