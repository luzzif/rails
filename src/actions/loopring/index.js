import { getLoopringApiKey } from "../../utils/loopring";
import Wallet from "../../lightcone/wallet";
import Web3 from "web3";
import { web3Modal } from "../../containers/app";
import {
    lightconeGetAccount,
    getExchangeInfo,
    getDepositHistory,
    getWithdrawalHistory,
} from "../../lightcone/api/LightconeAPI";
import { getBalances } from "../../lightcone/api/v1/balances/get";
import { getTokenInfo } from "../../lightcone/api/v1/tokeninfo/get";
import { getPrice } from "../../lightcone/api/v1/price/get";
import BigNumber from "bignumber.js";
import { getTransferHistory } from "../../lightcone/api/v1/transfer/get";
import config from "../../lightcone/config";
import { submitTransfer } from "../../lightcone/api/v1/transfer";
import {
    postUniversalLoading,
    deleteUniversalLoading,
} from "../universal-loadings";

export const INTIIALIZE_SUCCESS = "INTIIALIZE_SUCCESS";
export const GET_SUPPORTED_TOKENS_SUCCESS = "GET_SUPPORTED_TOKENS_SUCCESS";
export const GET_BALANCES_SUCCESS = "GET_BALANCES_SUCCESS";
export const GET_TRANSACTIONS_SUCCESS = "GET_TRANSACTIONS_SUCCESS";
export const POST_TRANSACTIONS_LOADING = "POST_TRANSACTIONS_LOADING";
export const DELETE_TRANSACTIONS_LOADING = "DELETE_TRANSACTIONS_LOADING";
export const POST_TRANSFER_LOADING = "POST_TRANSFER_LOADING";
export const DELETE_TRANSFER_LOADING = "DELETE_TRANSFER_LOADING";
export const POST_TRANSFER_SUCCESS = "POST_TRANSFER_SUCCESS";
export const DELETE_TRANSFER_HASH = "DELETE_TRANSFER_HASH";

export const initializeLoopring = () => async (dispatch) => {
    try {
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const selectedAccount = accounts[0];
        const wallet = new Wallet("MetaMask", web3, selectedAccount);
        const account = await lightconeGetAccount(selectedAccount);
        const exchange = await getExchangeInfo();
        const { exchangeAddress } = exchange;
        const { keyPair } = await wallet.generateKeyPair(
            exchangeAddress,
            account.keyNonce
        );
        const { publicKeyX, publicKeyY } = keyPair;
        if (
            account.publicKeyX !== publicKeyX ||
            account.publicKeyY !== publicKeyY
        ) {
            throw new Error(
                "api got and locally generated public keys don't match"
            );
        }
        wallet.keyPair = keyPair;
        wallet.accountId = account.accountId;
        dispatch({ type: INTIIALIZE_SUCCESS, account, wallet, exchange });
    } catch (error) {
        console.error("error initializing loopring", error);
    }
};

export const getSupportedTokens = () => async (dispatch) => {
    dispatch(postUniversalLoading());
    try {
        dispatch({
            type: GET_SUPPORTED_TOKENS_SUCCESS,
            supportedTokens: await getTokenInfo(),
        });
    } catch (error) {
        console.error("error getting loopring supported tokens", error);
    }
    dispatch(deleteUniversalLoading());
};

export const getUserBalances = (account, wallet, supportedTokens) => async (
    dispatch
) => {
    dispatch(postUniversalLoading());
    try {
        const partialBalances = await getBalances(
            account.accountId,
            await getLoopringApiKey(wallet, account),
            supportedTokens
        );
        const fiatBalances = await getPrice("USD");
        // we process the tokens with no balance too,
        // saving them with a 0 balance if necessary
        const allBalances = supportedTokens
            .reduce((allBalances, supportedToken) => {
                const supportedTokenId = supportedToken.tokenId;
                const supportedTokenSymbol = supportedToken.symbol;
                const matchingBalance = partialBalances.find(
                    (balance) => balance.tokenId === supportedTokenId
                );
                const matchingFiatValue = fiatBalances.find(
                    (balance) => balance.symbol === supportedTokenSymbol
                );
                const balance = new BigNumber(
                    matchingBalance ? matchingBalance.totalAmount : "0"
                );
                const fiatValue = new BigNumber(
                    matchingFiatValue ? matchingFiatValue.price : "0"
                );
                allBalances.push({
                    id: supportedTokenId,
                    symbol: supportedTokenSymbol,
                    name: supportedToken.name,
                    address: supportedToken.address,
                    balance,
                    fiatValue,
                });
                return allBalances;
            }, [])
            .sort((a, b) =>
                b.balance
                    .multipliedBy(b.fiatValue)
                    .minus(a.balance.multipliedBy(a.fiatValue))
                    .toNumber()
            );
        dispatch({ type: GET_BALANCES_SUCCESS, balances: allBalances });
    } catch (error) {
        console.error("error getting loopring user balances", error);
    }
    dispatch(deleteUniversalLoading());
};

// FIXME: not particularly efficient (every time we fetch the whole transactions list anew)
export const getTokenTransactions = (
    account,
    wallet,
    tokenSymbol,
    supportedTokens,
    amount
) => async (dispatch) => {
    dispatch({ type: POST_TRANSACTIONS_LOADING });
    try {
        const apiKey = await getLoopringApiKey(wallet, account);
        const transfers = await getTransferHistory(
            account.accountId,
            tokenSymbol,
            amount,
            0,
            apiKey,
            supportedTokens
        );
        const deposits = await getDepositHistory(
            account.accountId,
            tokenSymbol,
            amount,
            0,
            apiKey,
            supportedTokens
        );
        const withdrawals = await getWithdrawalHistory(
            account.accountId,
            tokenSymbol,
            amount,
            0,
            apiKey,
            supportedTokens
        );
        const transactions = transfers.transactions
            .map((transfer) => {
                transfer.transfer = true;
                transfer.amount = new BigNumber(transfer.amount);
                transfer.feeAmount = new BigNumber(transfer.feeAmount);
                transfer.sent =
                    wallet.address.toLowerCase() ===
                    transfer.senderAddress.toLowerCase();
                return transfer;
            })
            .concat(
                deposits.transactions
                    .filter(
                        (deposit) => deposit.depositType !== "create_account"
                    )
                    .map((deposit) => {
                        deposit.deposit = true;
                        deposit.amount = new BigNumber(deposit.amount);
                        deposit.feeAmount = new BigNumber(deposit.feeAmount);
                        return deposit;
                    })
            )
            .concat(
                withdrawals.transactions.map((withdrawal) => {
                    withdrawal.withdrawal = true;
                    withdrawal.amount = new BigNumber(withdrawal.amount);
                    withdrawal.feeAmount = new BigNumber(withdrawal.feeAmount);
                    return withdrawal;
                })
            )
            .sort((a, b) => a.timestamp - b.timestamp);
        dispatch({ type: GET_TRANSACTIONS_SUCCESS, transactions });
    } catch (error) {
        console.error("error getting loopring token transactions", error);
    }
    dispatch({ type: DELETE_TRANSACTIONS_LOADING });
};

export const postTransfer = (
    account,
    wallet,
    exchange,
    tokenSymbol,
    receiver,
    memo,
    amount,
    supportedTokens
) => async (dispatch) => {
    dispatch({ type: POST_TRANSFER_LOADING });
    try {
        const { accountNonce: nonce } = await lightconeGetAccount(
            wallet.address
        );
        const { accountId: receiverAccountId } = await lightconeGetAccount(
            receiver
        );
        debugger;
        const { exchangeId, transferFees } = exchange;
        let fee = "0";
        if (transferFees) {
            const transferFee = transferFees.find(
                (fee) => fee.token === tokenSymbol
            );
            if (transferFee) {
                fee = config.fromWEI(
                    tokenSymbol,
                    transferFee.fee,
                    supportedTokens
                );
            }
        }
        // FIXME: is this input data correct?
        const { transfer, ecdsaSig } = await wallet.signTransfer(
            {
                exchangeId: exchangeId,
                receiver: receiverAccountId,
                token: tokenSymbol,
                amount,
                tokenF: tokenSymbol,
                amountF: fee,
                nonce,
                label: config.getLabel(),
                memo,
            },
            supportedTokens
        );
        const transferHash = await submitTransfer(
            transfer,
            ecdsaSig,
            await getLoopringApiKey(wallet, account)
        );
        dispatch({ type: POST_TRANSFER_SUCCESS, hash: transferHash });
    } catch (error) {
        console.error("error posting loopring transfer", error);
    }
    dispatch({ type: DELETE_TRANSFER_LOADING });
};

export const deleteTransferHash = () => async (dispatch) => {
    dispatch({ type: DELETE_TRANSFER_HASH });
};
