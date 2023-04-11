import { Chip } from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";

const StaticData = () => (
  <Chip
    sx={{ float: "right" }}
    color="warning"
    label="Static data"
    icon={<ReportIcon />}
  />
);

export default StaticData;
