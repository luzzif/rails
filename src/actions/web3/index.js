import { getWeb3Modal } from "../../containers/app";
import { postLogout } from "../loopring";
import Web3 from "web3";

export const INITIALIZE_WEB3_SUCCESS = "INITIALIZE_WEB3_SUCCESS";
export const CHAIN_ID_DETECTION_SUCCESS = "CHAIN_ID_DETECTION_SUCCESS";

export const initializeWeb3 = () => async (dispatch) => {
    try {
        const web3Modal = getWeb3Modal();
        const provider = await web3Modal.connect();
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
        const chainId = await web3Instance.eth.getChainId();
        dispatch({ type: CHAIN_ID_DETECTION_SUCCESS, chainId });
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
