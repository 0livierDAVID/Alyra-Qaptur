import { Paper, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Paper
            component="footer"
            variant="outlined"
            color="neutral"
            sx={{
                justifyContent: "center",
                display: "flex",
                marginTop: 'calc(10% + 60px)',
                position: 'fixed',
                bottom: 0,
                width: '100%',
            }}
        >
            <Typography variant="caption" py={2}>
                &copy; Alyra x Qaptur
            </Typography>

        </Paper>
    );
};

export default Footer;