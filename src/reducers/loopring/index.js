import {
    INTIIALIZE_SUCCESS,
    GET_BALANCES_SUCCESS,
    GET_SUPPORTED_TOKENS_SUCCESS,
    GET_TRANSACTIONS_SUCCESS,
    POST_TRANSACTIONS_LOADING,
    DELETE_TRANSACTIONS_LOADING,
    POST_TRANSFER_SUCCESS,
    DELETE_TRANSFER_HASH,
    GET_ALLOWANCE_SUCCESS,
    POST_GET_ALLOWANCE_LOADING,
    DELETE_GET_ALLOWANCE_LOADING,
    DELETE_GRANT_ALLOWANCE_LOADING,
    POST_GRANT_ALLOWANCE_LOADING,
    GRANT_ALLOWANCE_SUCCESS,
    DELETE_GRANT_ALLOWANCE_TRANSACTION_HASH,
    GET_DEPOSIT_BALANCE_SUCCESS,
    POST_DEPOSIT_SUCCESS,
    DELETE_DEPOSIT_TRANSACTION_HASH,
    POST_GET_BALANCES_LOADING,
    DELETE_GET_BALANCES_LOADING,
    POST_SELECTED_ASSET,
    POST_WITHDRAWAL_SUCCESS,
    DELETE_WITHDRAWAL_TRANSACTION_HASH,
    POST_SELECTED_FIAT,
} from "../../actions/loopring";

const initialState = {
    account: null,
    wallet: null,
    exchange: null,
    supportedTokens: [],
    balances: { loadings: 0, data: [] },
    transactions: {
        loadings: 0,
        data: [],
    },
    successfulTransferHash: null,
    successfulGrantAllowanceHash: null,
    allowances: {
        loadings: 0,
    },
    depositBalance: null,
    depositHash: null,
    selectedAsset: null,
    withdrawalTransactionHash: null,
    selectedFiat: null,
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
                balances: { ...state.balances, data: action.balances },
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
        case POST_GRANT_ALLOWANCE_LOADING:
        case POST_GET_ALLOWANCE_LOADING: {
            return {
                ...state,
                allowances: {
                    ...state.allowances,
                    loadings: state.allowances.loadings + 1,
                },
            };
        }
        case DELETE_GRANT_ALLOWANCE_LOADING:
        case DELETE_GET_ALLOWANCE_LOADING: {
            return {
                ...state,
                allowances: {
                    ...state.allowances,
                    loadings: state.allowances.loadings - 1,
                },
            };
        }
        case GET_ALLOWANCE_SUCCESS: {
            return {
                ...state,
                allowances: {
                    ...state.allowances,
                    [action.token]: action.allowance,
                },
            };
        }
        case GRANT_ALLOWANCE_SUCCESS: {
            return {
                ...state,
                successfulGrantAllowanceHash: action.transactionHash,
            };
        }
        case DELETE_GRANT_ALLOWANCE_TRANSACTION_HASH: {
            return {
                ...state,
                successfulGrantAllowanceHash: null,
            };
        }
        case GET_DEPOSIT_BALANCE_SUCCESS: {
            return {
                ...state,
                depositBalance: action.balance,
            };
        }
        case POST_DEPOSIT_SUCCESS: {
            return { ...state, depositHash: action.transactionHash };
        }
        case DELETE_DEPOSIT_TRANSACTION_HASH: {
            return { ...state, depositHash: null };
        }
        case POST_GET_BALANCES_LOADING: {
            return {
                ...state,
                balances: {
                    ...state.balances,
                    loadings: state.balances.loadings + 1,
                },
            };
        }
        case DELETE_GET_BALANCES_LOADING: {
            return {
                ...state,
                balances: {
                    ...state.balances,
                    loadings: state.balances.loadings - 1,
                },
            };
        }
        case POST_SELECTED_ASSET: {
            return { ...state, selectedAsset: action.asset };
        }
        case POST_WITHDRAWAL_SUCCESS: {
            return {
                ...state,
                withdrawalTransactionHash: action.transactionHash,
            };
        }
        case DELETE_WITHDRAWAL_TRANSACTION_HASH: {
            return {
                ...state,
                withdrawalTransactionHash: null,
            };
        }
        case POST_SELECTED_FIAT: {
            return { ...state, selectedFiat: action.fiat };
        }
        default: {
            return state;
        }
    }
};
