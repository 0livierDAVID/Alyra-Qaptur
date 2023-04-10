import Head from "next/head";

import Layout from "@/components/Layout";
import {
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Chip,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SystemSecurityUpdateGoodIcon from "@mui/icons-material/SystemSecurityUpdateGood";
import GppGoodIcon from "@mui/icons-material/GppGood";

export default function App() {
  return (
    <Layout>
      <Head>
        <title>Welcome page - Qaptur</title>
      </Head>
      <Typography variant="h2" component="h1" sx={{ textAlign: "center" }}>
        The only carbon credits verified by satellite images and traced in the
        blockchain
      </Typography>
      <Typography variant="h4" component="p" sx={{ textAlign: "center" }}>
        Offset your residual emissions with confidence
      </Typography>

      {/*Block1 full width */}
      <Box sx={{ width: "100%", m: 2, mb: 4 }}>
        <img src="/images/landing/1-earth-satellite-view.jpg" width="97%" />
        <Typography
          variant="body2"
          component="p"
          sx={{ textAlign: "center", margin: "auto" }}
        >
          Finance what you see. See what you have financed.
        </Typography>
      </Box>

      {/*Block2 full width */}
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Grid item xs={12} sm={6} sx={{}}>
          <img
            src="/images/landing/2-satellite.png"
            width="350px"
            margin="auto"
          />
          <Typography variant="body2" component="p">
            Take back control of your carbon investments
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ color: "vars(--primary)" }} component="p">
            WHY CHOOSE US?
          </Typography>
          <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
            Invest in trustworthy carbon assets
          </Typography>
          <Typography variant="body2" component="h1">
            Qaptur is fixing today's carbon credits limitation.
          </Typography>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <ThumbUpAltIcon />
              </ListItemIcon>
              <ListItemText
                primary="Quality credits"
                secondary={
                  <Typography
                    sx={{ display: "inline" }}
                    component="p"
                    variant="body2"
                    color="text.primary"
                  >
                    Every carbon credits on Qaptur's marketplace have been
                    verified through remote sensing from European Space Agency
                    satellites data, ensuring an accurate calculation of CO2
                    uptakes.
                  </Typography>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <SystemSecurityUpdateGoodIcon />
              </ListItemIcon>
              <ListItemText
                primary="
                Clear and robust accountability"
                secondary={
                  <Typography
                    sx={{ display: "inline" }}
                    component="p"
                    variant="body2"
                    color="text.primary"
                  >
                    With Qaptur's blockchain protocol, your proofs of financing
                    and proofs of offseting are secured over decades.
                  </Typography>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <GppGoodIcon />
              </ListItemIcon>
              <ListItemText
                primary="Unrisk your investment"
                secondary={
                  <Typography
                    sx={{ display: "inline" }}
                    component="p"
                    variant="body2"
                    color="text.primary"
                  >
                    Lock assets today to control the price you pay to offset
                    your emissions in the future. Be sure to pay for the right
                    amount and avoid press criticism.
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{ color: "vars(--primary)", textAlign: "center" }}
          component="p"
        >
          DO YOU WANT TO OFFSET YOUR EMISSIONS RIGHT NOW OR DO YOU WANT TO
          PREPARE YOUR COMPANY'S CARBON FUTURE STRATEGY?
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Various types of assets
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardHeader
              avatar={<Avatar alt="QLAND" src="/images/landing/QLAND.png" />}
              title="QLAND"
            />
            <CardContent>
              <Typography variant="body2">
                QLANDs represent a fraction of a carbon project. They allow the
                financing of new projects. Each year, after Qaptur verification,
                they issue QC02.
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Chip label="ERC1155" />
            </CardActions>
          </Card>

          <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardHeader
              avatar={<Avatar alt="QCO2" src="/images/landing/QCO2.png" />}
              title="QCO2"
            />
            <CardContent>
              <Typography variant="body2">
                1 QCO2 equals 1 carbon credit. In order to register it in your
                carbon accounting, you just have to "burn" your QCO2 in the
                blockchain, and claim your offset certificate.
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Chip label="ERC1155" />
            </CardActions>
          </Card>
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{ color: "vars(--primary)", textAlign: "center" }}
          component="p"
        >
          READY TO OFFSET CURRENT AND FUTURE EMISSIONS?
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Visit our marketplace
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" sx={{ m: 2 }}>
            Offset emissions
          </Button>
          <Button variant="contained" sx={{ m: 2 }}>
            Invest in carbon
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
