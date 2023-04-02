import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

export default function TabProjectCard() {
  return (
    <Grid item xs={6} sm={4} lg={3} xl={2}>
      <Card variant="outlined">
        <CardMedia
          component="img"
          image="/images/projects/project-1.png"
          alt="Project name"
        />
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Project name
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Project location
          </Typography>
          <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
            3 shares
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
