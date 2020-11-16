import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { postLogout } from "../loopring";

export const INITIALIZE_WEB3_SUCCESS = "INITIALIZE_WEB3_SUCCESS";
export const CHAIN_ID_DETECTION_SUCCESS = "CHAIN_ID_DETECTION_SUCCESS";

export const initializeWeb3 = (provider, connectorName) => async (dispatch) => {
    provider.autoRefreshOnNetworkChange = false;
    provider.on("chainChanged", (hexChainId) => {
        const chainId = parseInt(hexChainId, 16);
        dispatch({ type: CHAIN_ID_DETECTION_SUCCESS, chainId });
        dispatch(postLogout());
    });
    provider.on("accountsChanged", () => {
        dispatch(postLogout());
    });
    const web3Instance = new Web3(provider);
    let chainId, selectedAccount;
    if (provider instanceof WalletConnectProvider) {
        chainId = provider.chainId;
        selectedAccount = provider.accounts[0];
    } else {
        chainId = await web3Instance.eth.net.getId();
        const wrappedSelectedAccount = await web3Instance.eth.getAccounts();
        selectedAccount = wrappedSelectedAccount[0];
    }
    dispatch({ type: CHAIN_ID_DETECTION_SUCCESS, chainId });
    dispatch({
        type: INITIALIZE_WEB3_SUCCESS,
        web3: web3Instance,
        selectedAccount,
    });
};
