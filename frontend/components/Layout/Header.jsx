import Image from "next/image";
import Link from "next/link";
import { AppBar, Container, Toolbar, Typography, Box } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <AppBar position="static" component="header">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Image
              src="/images/qaptur.svg"
              alt="Qaptur logo"
              width={195}
              height={40}
              component={Link}
              href="/"
            />
          </Box>

          <Box
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
            }}
          >
            <Image
              src="/images/qaptur-mobile.svg"
              alt="Qaptur logo"
              width={40}
              height={40}
              component={Link}
              href="/"
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <ConnectButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
