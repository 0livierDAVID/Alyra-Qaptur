import {
  Avatar,
  Grid,
  Card,
  CardActionArea,
  Chip,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

export default function CarbonCreditCard() {
  return (
    <Grid item xs={12} sm={6} lg={4} xl={3}>
      <Card variant="outlined">
        {/* <CardActionArea> */}
        <Chip sx={{ float: "right", m: 1 }} label="2020" />
        <CardHeader subheader="Project name (Country)" />

        <CardMedia
          component="img"
          height="140"
          image="/images/projects/project-1.png"
          alt="Project name"
        />
        <CardContent sx={{ display: "flex", justifyContent: "space-around" }}>
          <Chip label={`Available: 10`} />
          <Chip
            label={`15 USDC`}
            avatar={<Avatar alt="USDC logo" src="/images/usdc.svg" />}
          />
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "end" }}>
          <Button variant="contained">Buy</Button>
        </CardActions>
        {/* </CardActionArea> */}
      </Card>
    </Grid>
  );
}
