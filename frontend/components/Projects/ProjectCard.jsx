import Link from "next/link";
import {
  Grid,
  Card,
  CardActionArea,
  Chip,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";

export default function ProjectCard() {
  const id = 1;
  return (
    <Grid item xs={12} sm={6} lg={4} xl={3}>
      <Card variant="outlined">
        <CardActionArea component={Link} href={`/projects/${id}`}>
          <CardHeader title="Project name" subheader="Project location" />
          <CardMedia
            component="img"
            height="140"
            image="/images/projects/project-1.png"
            alt="Project name"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
              voluptates? At dolorum asperiores illum atque quia voluptatum
              voluptate! Natus aspernatur aut debitis earum, voluptatibus
              aliquid labore cum eligendi iure sit tempore voluptatem,
              necessitatibus asperiores consequuntur vel dolorum ipsam eveniet.
              Quam, deleniti. Magni minus inventore aspernatur facilis ullam ad
              quia harum.
            </Typography>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "end" }}>
            <Chip label="Available: 12" />
            <Chip label="From: 100 USDC" />
          </CardActions>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
