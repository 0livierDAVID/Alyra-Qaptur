import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { hardhat, polygonMumbai, goerli, sepolia } from "wagmi/chains";
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from "wagmi/providers/public";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

const { chains, provider } = configureChains(
  [hardhat, polygonMumbai, goerli, sepolia],
  [
    //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]
);

// const { connectors } = getDefaultWallets({
//   appName: "Qaptur",
//   chains,
// });

const connectors = connectorsForWallets([
  {
    appName: "Qaptur",
    groupName: "Recommended",
    wallets: [metaMaskWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// https://muhimasri.com/blogs/how-to-customize-theme-and-colors-in-material-ui/
const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#242330",
    },
    secondary: {
      main: "#59CCCF",
    },
    ternary: {
      main: "#EF2B5A",
    },
    neutral: {
      main: "#D8D8D8",
    },
  },
});

const montserrat = Montserrat({
  weight: ["400", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} initialChain={polygonMumbai}>
          <style jsx global>{`
            html {
              font-family: ${montserrat.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}
