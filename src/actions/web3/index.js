import { getWeb3Modal } from "../../containers/app";
import { postLogout } from "../loopring";
import Web3 from "web3";

export const INITIALIZE_WEB3_SUCCESS = "INITIALIZE_WEB3_SUCCESS";

export const initializeWeb3 = () => async (dispatch) => {
    try {
        const web3Modal = getWeb3Modal();
        const provider = await web3Modal.connect();
        provider.autoRefreshOnNetworkChange = false;
        provider.on("networkChanged", () => {
            dispatch(postLogout());
        });
        provider.on("accountsChanged", () => {
            dispatch(postLogout());
        });
        dispatch({ type: INITIALIZE_WEB3_SUCCESS, web3: new Web3(provider) });
    } catch (error) {
        console.error("error initializing web3", error);
    }
};
