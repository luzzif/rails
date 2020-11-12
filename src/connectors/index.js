import { InjectedConnector } from "@web3-react/injected-connector";
import { AuthereumConnector } from "@web3-react/authereum-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const INFURA_PROJECT_ID = "0ebf4dd05d6740f482938b8a80860d13";

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 5],
});

// mainnet only
export const walletConnectConnector = new WalletConnectConnector({
    rpc: {
        1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: 15000,
});

// mainnet only
export const authereumConnector = new AuthereumConnector({ chainId: 1 });
