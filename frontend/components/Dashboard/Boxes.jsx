import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";

export default function Boxes({ projects, userProjects }) {
  const [nbCobenefits, setNbCobenefits] = useState(0);
  useEffect(() => {
    if (projects.length > 0 && userProjects.length > 0) {
      let count = 0;
      userProjects.map((uProject) => {
        const current = projects.find((project) => uProject.id === project.id);
        count += current?.attributes.cobenefits.length;
      });
      setNbCobenefits(count);
    }
  }, [projects, userProjects]);
  return (
    <Grid
      container
      spacing={1}
      sx={{ display: "flex", justifyContent: "space-around", m: 2 }}
    >
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5" component="p" sx={{ textAlign: "center" }}>
              {userProjects.length}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              projects supported
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5" component="p" sx={{ textAlign: "center" }}>
              {nbCobenefits}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              co-benefits
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5" component="p" sx={{ textAlign: "center" }}>
              {0}
              {/* temp */}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              t of CO2 removed
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
