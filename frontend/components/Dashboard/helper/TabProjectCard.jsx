import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function TabProjectCard({ id, name, country, nbShare, image }) {
  return (
    <Grid item xs={6} sm={4} lg={3} xl={2}>
      <Card variant="outlined">
        <CardMedia component="img" image={image} alt={name} />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {country}
          </Typography>
          <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
            {nbShare} share(s)
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
