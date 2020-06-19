import {
    INTIIALIZE_SUCCESS,
    GET_BALANCES_SUCCESS,
    GET_SUPPORTED_TOKENS_SUCCESS,
    GET_TRANSACTIONS_SUCCESS,
    POST_TRANSACTIONS_LOADING,
    DELETE_TRANSACTIONS_LOADING,
    POST_TRANSFER_SUCCESS,
    DELETE_TRANSFER_HASH
} from "../../actions/loopring";

const initialState = {
    account: null,
    wallet: null,
    exchange: null,
    supportedTokens: [],
    balances: [],
    transactions: {
        loadings: 0,
        data: [],
    },
    successfulTransferHash: null,
};

export const loopringReducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case INTIIALIZE_SUCCESS: {
            return {
                ...state,
                account: action.account,
                wallet: action.wallet,
                exchange: action.exchange,
            };
        }
        case GET_SUPPORTED_TOKENS_SUCCESS: {
            return {
                ...state,
                supportedTokens: action.supportedTokens,
            };
        }
        case GET_BALANCES_SUCCESS: {
            return {
                ...state,
                balances: action.balances,
            };
        }
        case POST_TRANSACTIONS_LOADING: {
            return {
                ...state,
                transactions: {
                    ...state.transactions,
                    loadings: state.transactions.loadings + 1,
                },
            };
        }
        case DELETE_TRANSACTIONS_LOADING: {
            return {
                ...state,
                transactions: {
                    ...state.transactions,
                    loadings:
                        state.transactions.loadings &&
                        state.transactions.loadings - 1,
                },
            };
        }
        case GET_TRANSACTIONS_SUCCESS: {
            return {
                ...state,
                transactions: {
                    ...state.transactions,
                    data: action.transactions,
                },
            };
        }
        case POST_TRANSFER_SUCCESS: {
            return {
                ...state,
                successfulTransferHash: action.hash,
            };
        }
        case DELETE_TRANSFER_HASH: {
            return { ...state, successfulTransferHash: null };
        }
        default: {
            return state;
        }
    }
};
