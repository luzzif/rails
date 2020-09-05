import {
    INITIALIZE_WEB3_SUCCESS,
    CHAIN_ID_DETECTION_SUCCESS,
} from "../../actions/web3";
import { POST_LOGOUT } from "../../actions/loopring";

const initialState = {
    instance: null,
    selectedAccount: null,
    chainId: null,
};

export const web3Reducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case INITIALIZE_WEB3_SUCCESS: {
            return {
                ...state,
                instance: action.web3,
                selectedAccount: action.selectedAccount,
            };
        }
        case POST_LOGOUT: {
            return { ...initialState };
        }
        case CHAIN_ID_DETECTION_SUCCESS: {
            return { ...state, chainId: action.chainId };
        }
        default: {
            return state;
        }
    }
};
