import Link from "next/link";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Co2Icon from "@mui/icons-material/Co2";
import ItemMenuTxt from "./helper/ItemMenuTxt";

export default function AdminMenu() {
  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Admin
        </ListSubheader>
      }
    >
      <List component="div" disablePadding>
        <ListItemButton
          component={Link}
          href="/admin/projects/add"
          title="Add project"
        >
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon>
          <ItemMenuTxt label="Add project" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/admin/projects/reward"
          title="Set reward"
        >
          <ListItemIcon>
            <Co2Icon />
          </ListItemIcon>
          <ItemMenuTxt label="Set reward" />
        </ListItemButton>
      </List>
    </List>
  );
}
