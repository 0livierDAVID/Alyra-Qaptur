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
  Typography,
  CardActions,
  Button,
  FormControl,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Box,
} from "@mui/material";
import { useContracts } from "@/context/contractsContext";
import { useProjectsDispatch } from "@/context/projectsContext";
import { toMwei } from "@/utils";
import ModalTransactionHelper from "@/components/Projects/ModalTransactionHelper";

//modal style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProjectInvest({
  id: projectId,
  qlandAddr,
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

  //modal and stepper management
  const [open, setOpen] = useState(false);
  const modalOpen = () => setOpen(true);
  const modalClose = () => setOpen(false);
  const [activeStep, setActiveStep] = useState(0);
  const handleReset = () => {
    setActiveStep(0);
  };

  // usdc & market place contract
  const buyShares = async () => {
    try {
      if (!nbShare || nbShare < 0 || nbShare > availableSupply) return;
      modalOpen();
      // console.log(price);
      const amount = nbShare * price;

      // usdc approval
      setActiveStep(1);
      const contractUsdc = new Contract(usdc.address, usdc.abi, signer);
      const userUsdc = contractUsdc.connect(signer);
      const transaction1 = await userUsdc.approve(
        qlandMarketplace.address,
        toMwei(amount)
      );
      await transaction1.wait();
      let msgTxt = `Validation hash: ${transaction1.hash}`;

      // mint from initial supply
      setActiveStep(2);
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
      msgTxt += `\nPurchase hash: ${transaction2.hash}`;

      // update available supply
      setActiveStep(3);
      const mainContract = new Contract(main.address, main.abi, provider);
      const newSupply = await mainContract.getAvailableSupply(
        BigNumber.from(projectId)
      );
      dispatch({
        type: "updateSupply",
        projectId,
        newSupply: newSupply.toNumber(),
      });
      modalClose();
      handleReset();
      setNotif({
        type: "success",
        msg: `You successfuly bought ${nbShare} share(s)\n ${msgTxt}`,
      });
    } catch (error) {
      modalClose();
      handleReset();
      setNotif({
        type: "error",
        msg: `Error during the transaction: ${error}`,
      });
    }
  };

  return (
    <>
      {/* Modal skeleton */}
      <Modal
        open={open}
        onClose={modalClose}
        aria-labelledby="modal-transaction-helper"
        aria-describedby="modal to guide user during transaction process"
      >
        <Box sx={style}>
          <ModalTransactionHelper
            activeStep={activeStep}
            amount={nbShare * price}
          />
        </Box>
      </Modal>
      {/* Invest form */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardHeader
            title="Invest in this project"
            subheader="Invest now or you will regret it soon!"
          />
          <CardContent>
            <Typography sx={{ mt: -2, fontSize: 14 }} color="text.secondary">
              Estimated yearly carbon credits emission:{" "}
              {attributes?.annualCreditsExpected}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              Available share: {availableSupply}
            </Typography>
            <Typography sx={{ mb: 2, fontSize: 14 }} color="text.secondary">
              Contract: {qlandAddr}
            </Typography>
            <FormControl fullWidth>
              <TextField
                placeholder="Set value"
                id="outlined-number"
                label="Number of shares"
                type="number"
                value={nbShare}
                InputProps={{
                  inputProps: {
                    max: availableSupply,
                    min: 0,
                  },
                }}
                onChange={(evt) => setNbShare(evt.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow sx={{ td: { border: 0, p: 1 } }}>
                    <TableCell align="left">Unit price:</TableCell>
                    <TableCell align="right">{price} USDC</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      td: {
                        p: 1,
                      },
                    }}
                  >
                    <TableCell align="left">Quantity of shares:</TableCell>
                    <TableCell align="center">{nbShare || 0} </TableCell>
                  </TableRow>
                  <TableRow sx={{ td: { border: 0 } }}>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      Total price:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {nbShare * price || 0} USDC
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {notif && <Alert severity={notif.type}>{notif.msg}</Alert>}
          </CardContent>
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "end",
              flexGrow: 1,
              placeSelf: "end",
            }}
          >
            <Button variant="contained" onClick={buyShares}>
              Invest
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}
