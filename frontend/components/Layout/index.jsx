import { Grid, Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import LeftMenu from "./LeftMenu";
import AdminMenu from "./AdminMenu";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Box sx={{ display: "flex", marginBottom: "5%" }}>
        <Box sx={{ width: { xs: "70px", md: "200px" }, flexShrink: 0 }}>
          <LeftMenu />
          {/* TODO Conditional display admin */}
          <AdminMenu />
        </Box>

        <Box
          sx={{
            width: { xs: "calc(100% - 70px)", md: "calc(100% - 200px)" },
            flexGrow: 1,
            p: 2,
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </>
  );
}
