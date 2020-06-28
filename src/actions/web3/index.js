import { getWeb3Modal } from "../../containers/app";
import { postLogout } from "../loopring";
import React from "react";
import Web3 from "web3";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

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
        toast.error(<FormattedMessage id="error.web3.initialization" />);
        console.error("error initializing web3", error);
    }
};
