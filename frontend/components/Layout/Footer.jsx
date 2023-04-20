import { Paper, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Paper
      square
      component="footer"
      variant="outlined"
      sx={{
        justifyContent: "center",
        display: "flex",
        marginTop: "calc(10% + 60px)",
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#59CCCF",
      }}
    >
      <Typography
        variant="caption"
        py={2}
        sx={{ color: "white", fontWeight: "bold" }}
      >
        &copy; Alyra x Qaptur
      </Typography>
    </Paper>
  );
}
