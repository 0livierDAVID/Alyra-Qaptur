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
import { formatUSDC } from "@/utils";

export default function ProjectCard({
  id,
  name,
  description,
  image,
  availableSupply,
  price,
  attributes: { country },
}) {
  return (
    <Grid item xs={12} sm={6} lg={4} xl={3}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardActionArea component={Link} href={`/projects/${id}`}>
          <CardHeader title={name} subheader={country} />
          <CardMedia component="img" height="140" image={image} alt={name} />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "end" }}>
            <Chip label={`Available: ${availableSupply}`} />
            <Chip label={`From: ${formatUSDC(price)} USDC`} />
          </CardActions>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
