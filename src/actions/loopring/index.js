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
import { getAllowance } from "../../lightcone/api/v1/allowances/get";
import { getRecommendedGasPrice } from "../../lightcone/api/v1/recommendedGasPrice/get";
import { getEthNonce } from "../../lightcone/api/v1/ethnonce/get";
import { getTokenBalance } from "../../lightcone/api/v1/tokenBalance/get";
import { getEthBalance } from "../../lightcone/api/v1/ethBalance/get";

export const INTIIALIZE_SUCCESS = "INTIIALIZE_SUCCESS";
export const GET_SUPPORTED_TOKENS_SUCCESS = "GET_SUPPORTED_TOKENS_SUCCESS";
export const POST_GET_BALANCES_LOADING = "POST_GET_BALANCES_LOADING";
export const DELETE_GET_BALANCES_LOADING = "DELETE_GET_BALANCES_LOADING";
export const GET_BALANCES_SUCCESS = "GET_BALANCES_SUCCESS";
export const GET_TRANSACTIONS_SUCCESS = "GET_TRANSACTIONS_SUCCESS";
export const POST_TRANSACTIONS_LOADING = "POST_TRANSACTIONS_LOADING";
export const DELETE_TRANSACTIONS_LOADING = "DELETE_TRANSACTIONS_LOADING";
export const POST_TRANSFER_LOADING = "POST_TRANSFER_LOADING";
export const DELETE_TRANSFER_LOADING = "DELETE_TRANSFER_LOADING";
export const POST_TRANSFER_SUCCESS = "POST_TRANSFER_SUCCESS";
export const DELETE_TRANSFER_HASH = "DELETE_TRANSFER_HASH";
export const POST_GET_ALLOWANCE_LOADING = "POST_GET_ALLOWANCE_LOADING";
export const DELETE_GET_ALLOWANCE_LOADING = "DELETE_GET_ALLOWANCE_LOADING";
export const GET_ALLOWANCE_SUCCESS = "GET_ALLOWANCE_SUCCESS";
export const POST_GRANT_ALLOWANCE_LOADING = "POST_GRANT_ALLOWANCE_LOADING";
export const DELETE_GRANT_ALLOWANCE_LOADING = "DELETE_GRANT_ALLOWANCE_LOADING";
export const GRANT_ALLOWANCE_SUCCESS = "GRANT_ALLOWANCE_SUCCESS";
export const DELETE_GRANT_ALLOWANCE_TRANSACTION_HASH =
    "DELETE_GRANT_ALLOWANCE_TRANSACTION_HASH";
export const GET_DEPOSIT_BALANCE_SUCCESS = "GET_DEPOSIT_BALANCE_SUCCESS";
export const POST_DEPOSIT_SUCCESS = "POST_DEPOSIT_SUCCESS";
export const DELETE_DEPOSIT_TRANSACTION_HASH =
    "DELETE_DEPOSIT_TRANSACTION_HASHPOST_DEPOSIT_SUCCESS";
export const POST_SELECTED_ASSET = "POST_SELECTED_ASSET";
export const POST_WITHDRAWAL_SUCCESS = "POST_WITHDRAWAL_SUCCESS";
export const DELETE_WITHDRAWAL_TRANSACTION_HASH =
    "DELETE_WITHDRAWAL_TRANSACTION_HASH";
export const POST_SELECTED_FIAT = "POST_SELECTED_FIAT";
export const POST_LOGOUT = "POST_LOGOUT";

export const initializeLoopring = () => async (dispatch) => {
    try {
        const provider = await web3Modal.connect();
        provider.autoRefreshOnNetworkChange = false;
        provider.on("networkChanged", () => {
            dispatch(postLogout());
        });
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

export const getUserBalances = (
    account,
    wallet,
    supportedTokens,
    selectedFiat
) => async (dispatch) => {
    dispatch({ type: POST_GET_BALANCES_LOADING });
    try {
        const partialBalances = await getBalances(
            account.accountId,
            await getLoopringApiKey(wallet, account),
            supportedTokens
        );
        const fiatValues = await getPrice(selectedFiat.name);
        // we process the tokens with no balance too,
        // saving them with a 0 balance if necessary
        const allBalances = supportedTokens
            .filter((supportedToken) => supportedToken.enabled)
            .reduce((allBalances, supportedToken) => {
                const supportedTokenId = supportedToken.tokenId;
                const supportedTokenSymbol = supportedToken.symbol;
                const matchingBalance = partialBalances.find(
                    (balance) => balance.tokenId === supportedTokenId
                );
                const matchingFiatValue = fiatValues.find(
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
                    depositEnabled: supportedToken.depositEnabled,
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
    dispatch({ type: DELETE_GET_BALANCES_LOADING });
};

export const getDepositBalance = (
    wallet,
    tokenSymbol,
    supportedTokens
) => async (dispatch) => {
    try {
        const balance =
            tokenSymbol === "ETH"
                ? await getEthBalance(wallet.address)
                : await getTokenBalance(
                      wallet.address,
                      tokenSymbol,
                      supportedTokens
                  );
        dispatch({
            type: GET_DEPOSIT_BALANCE_SUCCESS,
            balance: new BigNumber(balance),
        });
    } catch (error) {
        console.error("error getting loopring user balance", error);
    }
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

export const getTokenAllowance = (
    wallet,
    tokenSymbol,
    supportedTokens
) => async (dispatch) => {
    dispatch({ type: POST_GET_ALLOWANCE_LOADING });
    try {
        dispatch({
            type: GET_ALLOWANCE_SUCCESS,
            token: tokenSymbol,
            allowance: new BigNumber(
                await getAllowance(wallet.address, tokenSymbol, supportedTokens)
            ),
        });
    } catch (error) {
        console.error(`error getting token ${tokenSymbol} allowance`, error);
    }
    dispatch({ type: DELETE_GET_ALLOWANCE_LOADING });
};

export const grantAllowance = (
    wallet,
    exchange,
    tokenSymbol,
    tokenAddress
) => async (dispatch) => {
    dispatch({ type: POST_GRANT_ALLOWANCE_LOADING });
    try {
        let { accountNonce: nonce } = await lightconeGetAccount(wallet.address);
        const { chainId, exchangeAddress } = exchange;
        dispatch({
            type: GRANT_ALLOWANCE_SUCCESS,
            transactionHash: await wallet.approveMax(
                tokenAddress,
                exchangeAddress,
                chainId,
                nonce,
                await getRecommendedGasPrice(),
                true
            ),
        });
    } catch (error) {
        console.error(`error requesting ${tokenSymbol} allowance`, error);
    }
    dispatch({ type: DELETE_GRANT_ALLOWANCE_LOADING });
};

export const deleteGrantAllowanceTransactionHash = () => async (dispatch) => {
    dispatch({ type: DELETE_GRANT_ALLOWANCE_TRANSACTION_HASH });
};

export const postDeposit = (
    wallet,
    exchange,
    supportedTokens,
    tokenSymbol,
    amount
) => async (dispatch) => {
    try {
        const { chainId, exchangeAddress, onchainFees } = exchange;
        const transactionHash = await wallet.depositTo(
            {
                exchangeAddress,
                chainId,
                token: config.getTokenBySymbol(tokenSymbol, supportedTokens),
                fee: config.getFeeByType("deposit", onchainFees).fee,
                amount,
                nonce: await getEthNonce(wallet.address),
                gasPrice: await getRecommendedGasPrice(),
            },
            true
        );
        dispatch({ type: POST_DEPOSIT_SUCCESS, transactionHash });
    } catch (error) {
        console.error(`error depositing ${tokenSymbol}`, error);
    }
};

export const deleteDepositTransactionHash = () => async (dispatch) => {
    dispatch({ type: DELETE_DEPOSIT_TRANSACTION_HASH });
};

export const registerAccount = () => async (dispatch) => {
    dispatch(postUniversalLoading());
    try {
        // TODO: consider moving the wallet initialization
        // in a specific action to avoid repeated code
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const selectedAccount = accounts[0];
        const wallet = new Wallet("MetaMask", web3, selectedAccount);
        // TODO: same todo above applies to the exchange info
        const {
            exchangeAddress,
            onchainFees,
            chainId,
        } = await getExchangeInfo();
        const tokens = await getTokenInfo();
        const fee = new BigNumber(
            config.getFeeByType("create", onchainFees).fee
        ).plus(config.getFeeByType("deposit", onchainFees).fee);
        const { keyPair } = await wallet.generateKeyPair(exchangeAddress, 0);
        if (!keyPair || !keyPair.secretKey) {
            throw new Error("failed to generate key pair");
        }
        await wallet.createOrUpdateAccount(
            keyPair,
            {
                exchangeAddress,
                fee: fee.toString(),
                chainId: chainId,
                token: config.getTokenBySymbol("ETH", tokens),
                amount: "",
                permission: "",
                nonce: await getEthNonce(wallet.address),
                gasPrice: await getRecommendedGasPrice(),
            },
            true
        );
    } catch (error) {
        console.error("error registering user", error);
    }
    dispatch(deleteUniversalLoading());
};

export const postSelectedAsset = (asset) => async (dispatch) => {
    dispatch({ type: POST_SELECTED_ASSET, asset });
};

export const postOnchainWithdrawal = (
    wallet,
    exchange,
    tokenSymbol,
    supportedTokens,
    amount
) => async (dispatch) => {
    try {
        const { exchangeAddress, chainId, onchainFees } = exchange;
        const transactionHash = await wallet.onchainWithdrawal(
            {
                exchangeAddress,
                chainId,
                token: config.getTokenBySymbol(tokenSymbol, supportedTokens),
                amount,
                nonce: await getEthNonce(wallet.address),
                gasPrice: await getRecommendedGasPrice(),
                fee: config.getFeeByType("withdraw", onchainFees).fee,
            },
            true
        );
        dispatch({ type: POST_WITHDRAWAL_SUCCESS, transactionHash });
    } catch (error) {
        console.error("error performing onchain withdrawal", error);
    }
};

export const deleteWithdrawalTransactionHash = () => async (dispatch) => {
    dispatch({ type: DELETE_WITHDRAWAL_TRANSACTION_HASH });
};

export const postSelectedFiat = (fiat) => async (dispatch) => {
    dispatch({ type: POST_SELECTED_FIAT, fiat });
};

export const postLogout = () => (dispatch) => {
    dispatch({ type: POST_LOGOUT });
};
