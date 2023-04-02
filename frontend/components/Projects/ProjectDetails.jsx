import Image from "next/image";
import { Box, Grid, List, ListItem, Typography } from "@mui/material";

export default function ProjectDetails() {
  return (
    <Grid item xs={12} md={6}>
      <Typography sx={{ ml: 2 }} color="text.secondary">
        Description:
      </Typography>
      <Typography sx={{ mb: 2, pr: 2 }} variant="body2" color="text.secondary">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
        voluptates? At dolorum asperiores illum atque quia voluptatum voluptate!
        Natus aspernatur aut debitis earum, voluptatibus aliquid labore cum
        eligendi iure sit tempore voluptatem, necessitatibus asperiores
        consequuntur vel dolorum ipsam eveniet. Quam, deleniti. Magni minus
        inventore aspernatur facilis ullam ad quia harum.
      </Typography>
      <List sx={{ mt: -2 }}>
        <ListItem>
          <Typography color="text.secondary">Co-benefits:</Typography>
          <Box sx={{ display: "flex", p: 1 }}>
            <Image
              src="/images/cobenefits/1.png"
              height={42}
              width={42}
              alt="Cobenefit name"
            />
            <Image
              src="/images/cobenefits/10.png"
              height={42}
              width={42}
              alt="Cobenefit name"
            />
            <Image
              src="/images/cobenefits/15.png"
              height={42}
              width={42}
              alt="Cobenefit name"
            />
          </Box>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Surface:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">AFOLU category:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Starting date:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Trees species:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Project leader:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Other entities:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Status:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Label:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">projectId for label:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Methodology:</Typography>
        </ListItem>
        <ListItem>
          <Typography color="text.secondary">Verificator:</Typography>
        </ListItem>
      </List>
    </Grid>
  );
}
