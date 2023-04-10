import { Alert } from "@mui/material";

const NotConnectedAlert = () => (
  <Alert sx={{ m: 2 }} severity="warning">
    You are not connected! <br /> Connect to the app with a wallet to start your
    journey with Qaptur!
  </Alert>
);

export default NotConnectedAlert;
