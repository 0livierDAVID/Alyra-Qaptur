import Link from "next/link";
import { List, ListItemButton, ListItemIcon } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import ForestIcon from "@mui/icons-material/Forest";
import Co2Icon from "@mui/icons-material/Co2";
import ItemMenuTxt from "./helper/ItemMenuTxt";

export default function LeftMenu() {
  return (
    <List sx={{ width: "100%" }} component="nav">
      <ListItemButton component={Link} href="/" title="Home">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ItemMenuTxt label="Home" />
      </ListItemButton>

      <ListItemButton component={Link} href="/dashboard" title="Dashboard">
        <ListItemIcon>
          <LineAxisIcon />
        </ListItemIcon>
        <ItemMenuTxt label="Dashboard" />
      </ListItemButton>

      <ListItemButton component={Link} href="/projects" title="Projects">
        <ListItemIcon>
          <ForestIcon />
        </ListItemIcon>
        <ItemMenuTxt label="Projects" />
      </ListItemButton>

      <ListItemButton
        component={Link}
        href="/carbon-credits"
        title="Carbon credits"
      >
        <ListItemIcon>
          <Co2Icon />
        </ListItemIcon>
        <ItemMenuTxt label="Carbon credits" />
      </ListItemButton>
    </List>
  );
}
