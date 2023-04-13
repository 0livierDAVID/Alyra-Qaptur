import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import LeftMenu from "./LeftMenu";
import AdminMenu from "./AdminMenu";
import LoadProjects from "../Projects/LoadProjects";
import useUserStatus from "@/hooks/useUserStatus";

export default function Layout({ children }) {
  const { isConnected, isAdmin } = useUserStatus();

  return (
    <>
      <Header />
      {/* {!isConnected && <Box sx={{ marginBottom: "5%" }}>{children}</Box>}
      {isConnected && ( */}
      <Box
        sx={{
          display: "flex",
          marginBottom: "5%",
          margin: "auto",
        }}
        maxWidth="xl"
      >
        <Box sx={{ width: { xs: "70px", md: "200px" }, flexShrink: 0 }}>
          <LeftMenu />
          {isAdmin && <AdminMenu />}
        </Box>

        <Box
          sx={{
            width: { xs: "calc(100% - 70px)", md: "calc(100% - 200px)" },
            flexGrow: 1,
            p: 2,
          }}
        >
          <LoadProjects />
          {children}
        </Box>
      </Box>
      {/* )} */}

      <Footer />
    </>
  );
}
