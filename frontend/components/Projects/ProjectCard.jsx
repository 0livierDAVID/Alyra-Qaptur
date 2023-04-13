import Link from "next/link";
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
  Typography,
  LinearProgress,
} from "@mui/material";

export default function ProjectCard({
  id,
  name,
  description,
  image,
  supply,
  availableSupply,
  price,
  attributes: { country },
}) {
  const preview = () => {
    if (description.length < 200) return description;
    return description.substring(0, 196) + "...";
  };

  return (
    <Grid item xs={12} sm={6} lg={4} xl={3}>
      <Card variant="outlined" sx={{ height: "100%" }}>
        <CardActionArea
          component={Link}
          href={`/projects/${id}`}
          sx={{ height: "100%" }}
        >
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Math.round(((supply - availableSupply) / supply) * 100)}
          />
          <CardHeader title={name} subheader={country} />
          <CardMedia component="img" height="140" image={image} alt={name} />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {preview()}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "end" }}>
            <Chip label={`Available: ${availableSupply} / ${supply}`} />
            <Chip
              label={`${price} USDC`}
              avatar={<Avatar alt="USDC logo" src="/images/usdc.svg" />}
            />
          </CardActions>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
