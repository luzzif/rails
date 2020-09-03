import { getWeb3Modal } from "../../containers/app";
import { postLogout } from "../loopring";
import Web3 from "web3";
import {
    enableTestMode,
    disableTestMode,
} from "loopring-lightcone/lib/request";

export const INITIALIZE_WEB3_SUCCESS = "INITIALIZE_WEB3_SUCCESS";

export const initializeWeb3 = () => async (dispatch) => {
    try {
        const web3Modal = getWeb3Modal();
        const provider = await web3Modal.connect();
        provider.autoRefreshOnNetworkChange = false;
        provider.on("chainChanged", (hexChainId) => {
            const chainId = parseInt(hexChainId, 16);
            if (chainId === 5) {
                console.log("goerli detected, enabling test mode...");
                enableTestMode();
            } else {
                console.log(
                    `chain with id ${chainId} detected, disabling test mode...`
                );
                disableTestMode();
            }
            dispatch(postLogout());
        });
        provider.on("accountsChanged", () => {
            dispatch(postLogout());
        });
        const web3Instance = new Web3(provider);
        const chainId = await web3Instance.eth.getChainId();
        if (chainId === 5) {
            console.log("goerli detected, enabling test mode...");
            enableTestMode();
        } else {
            console.log(
                `chain with id ${chainId} detected, disabling test mode...`
            );
            disableTestMode();
        }
        const [selectedAccount] = await web3Instance.eth.getAccounts();
        dispatch({
            type: INITIALIZE_WEB3_SUCCESS,
            web3: web3Instance,
            selectedAccount,
        });
    } catch (error) {
        console.error("error initializing web3", error);
    }
};
