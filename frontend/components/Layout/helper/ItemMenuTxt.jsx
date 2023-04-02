import { ListItemText } from "@mui/material";

const ItemMenuTxt = ({ label }) => (
  <ListItemText sx={{ display: { xs: "none", md: "block" } }} primary={label} />
);

export default ItemMenuTxt;
