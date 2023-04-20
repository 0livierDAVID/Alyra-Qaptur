import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Button,
} from "@mui/material";

const steps = [
  {
    label: "Transaction initialized",
    description: ``,
  },
  {
    label: "Waiting smart contract delegation approval",
    description: `You need to type the amount and validate the delegation in your wallet`,
  },
  {
    label: "Waiting purchase confirmation",
    description: `You need to validate, the transaction in your wallet`,
  },
  {
    label: "Transaction ended",
    description: ``,
  },
];

export default function ModalTransactionHelper({ activeStep, amount }) {
  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ maxWidth: 400 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Transaction in progress
        </Typography>
        <Typography id="modal-modal-description" sx={{ mb: 2 }}>
          To finalize your investment, you will need to perform 2 validations in
          your wallet application.
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 1 ? (
                    <Typography variant="caption">
                      Amount: {amount} USDC
                    </Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
