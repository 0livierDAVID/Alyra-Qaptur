import { useState } from "react";
import { useProvider, useSigner } from "wagmi";
import { BigNumber, Contract } from "ethers";
import {
  Alert,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  List,
  ListItem,
  Typography,
  CardActions,
  Button,
  FormControl,
} from "@mui/material";
import { useContracts } from "@/context/contractsContext";
import { useProjectsDispatch } from "@/context/projectsContext";
import { toMwei } from "@/utils";

export default function ProjectInvest({
  id: projectId,
  availableSupply,
  price,
  attributes,
}) {
  const { main, qlandMarketplace, usdc } = useContracts();
  const dispatch = useProjectsDispatch();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [nbShare, setNbShare] = useState("");
  const [notif, setNotif] = useState(null);

  // usdc & market place contract
  const buyShares = async () => {
    try {
      if (!nbShare) return;
      console.log(price);
      const amount = nbShare * price;

      // usdc approval
      const contractUsdc = new Contract(usdc.address, usdc.abi, signer);
      const userUsdc = contractUsdc.connect(signer);
      const transaction1 = await userUsdc.approve(
        qlandMarketplace.address,
        toMwei(amount)
      );
      await transaction1.wait();
      let msgTxt = `Validation hash: ${transaction1.hash}`;

      // mint from initial supply
      const marketplace = new Contract(
        qlandMarketplace.address,
        qlandMarketplace.abi,
        signer
      );
      const userMarketplace = marketplace.connect(signer);
      const transaction2 = await userMarketplace.buyFromInitialSupply(
        projectId,
        BigNumber.from(nbShare)
      );
      await transaction2.wait();
      msgTxt += `\nPurchase hash: ${transaction1.hash}`;

      // update available supply
      const mainContract = new Contract(main.address, main.abi, provider);
      const newSupply = await mainContract.getAvailableSupply(
        BigNumber.from(projectId)
      );
      dispatch({
        type: "updateSupply",
        projectId,
        newSupply: newSupply.toNumber(),
      });

      setNotif({
        type: "success",
        msg: `You successfuly bought ${nbShare} share(s)\n ${msgTxt}`,
      });
    } catch (error) {
      setNotif({
        type: "error",
        msg: `Error during the transaction: ${error}`,
      });
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <Card variant="outlined">
        <CardHeader
          title="Invest in this project"
          subheader="Invest now or you wille regret it soon!"
        />
        <CardContent>
          <Typography
            sx={{ mt: -2, mb: 2, fontSize: 14 }}
            color="text.secondary"
          >
            Estimated yearly carbon credits emission:{" "}
            {attributes?.annualCreditsExpected}
          </Typography>
          <FormControl fullWidth>
            <TextField
              placeholder="Set value"
              id="outlined-number"
              label="Number of shares"
              type="number"
              value={nbShare}
              onChange={(evt) => setNbShare(evt.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <List>
            <ListItem>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Available share: {availableSupply}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography
                sx={{ fontSize: 14, fontWeight: "bold" }}
                color="text.secondary"
              >
                Total price: {nbShare * price || 0} USDC
              </Typography>
            </ListItem>
          </List>
          {notif && <Alert severity={notif.type}>{notif.msg}</Alert>}
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "end" }}>
          <Button variant="contained" onClick={buyShares}>
            Invest
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
