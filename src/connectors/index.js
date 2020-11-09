import AuthereumApi from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Connectors } from "web3-react";
import { INFURA_PROJECT_ID } from "../commons";

export const injectedConnector = new Connectors.InjectedConnector();

class WalletConnectConnector extends Connectors.Connector {
    walletConnect;

    onActivation() {
        this.walletConnect = new WalletConnectProvider({
            infuraId: INFURA_PROJECT_ID,
        });
        return this.walletConnect.enable();
    }

    getProvider() {
        return this.walletConnect;
    }

    changeNetwork(network) {
        this.walletConnect = new WalletConnectProvider({
            infuraId: INFURA_PROJECT_ID,
        });
    }
}

export const walletConnectProvider = new WalletConnectConnector();

class AuthereumConnector extends Connectors.Connector {
    authereum;

    onActivation() {
        this.authereum = new AuthereumApi();
        return this.authereum.login();
    }

    getProvider() {
        return this.authereum.getProvider();
    }

    changeNetwork(network) {
        this.authereum = new AuthereumApi({
            networkId: network,
        });
    }
}

export const authereumConnector = new AuthereumConnector();
