/** WEB3: RainbowKit, WAGMI */
import "@rainbow-me/rainbowkit/styles.css";
import {
  // connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
// import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { hardhat, polygonMumbai, goerli, sepolia } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

const { chains, provider } = configureChains(
  [hardhat, polygonMumbai, goerli, sepolia],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY, priority: 0 }),
    infuraProvider({ apiKey: process.env.INFURA_API_KEY, priority: 0 }),
    publicProvider({ priority: 1 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Qaptur",
  chains,
});

/* /!\ https://www.rainbowkit.com/docs/custom-wallet-list /!\
  Note: This API is unstable and likely to change in the near future. 
  We recommend avoiding changes to the wallet list for now. */
// const connectors = connectorsForWallets([
//   {
//     appName: "Qaptur",
//     groupName: "Recommended",
//     wallets: [metaMaskWallet({ chains })],
//   },
// ]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

/** CONTEXT: user, contracts, projects */
import { UserProvider } from "@/context/userContext";
import { ContractsProvider } from "@/context/contractsContext";
import { ProjectsProvider } from "@/context/projectsContext";

/** STYLE */
// https://muhimasri.com/blogs/how-to-customize-theme-and-colors-in-material-ui/
const theme = createTheme({
  typography: {
    fontFamily: [
      "Montserrat",
      // 'BlinkMacSystemFont',
      // '"Segoe UI"',
      ,
    ].join(","),
  },
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
        <RainbowKitProvider chains={chains}>
          <UserProvider>
            <ContractsProvider>
              <ProjectsProvider>
                <style jsx global>{`
                  html {
                    font-family: ${montserrat.style.fontFamily};
                  }
                `}</style>
                <Component {...pageProps} />
              </ProjectsProvider>
            </ContractsProvider>
          </UserProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}
