import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function Boxes() {
  return (
    <Grid
      container
      spacing={1}
      sx={{ display: "flex", justifyContent: "space-around", m: 2 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
            354
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            t of CO2 removed
          </Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
            3
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            projects supported
          </Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ textAlign: "center" }}>
            3
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            co-benefits
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
