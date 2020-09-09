import React from "react";
import { getAccount } from "loopring-lightcone/lib/api/v2/account";
import { getApiKey } from "loopring-lightcone/lib/api/v2/account";
import { getExchangeInfo } from "loopring-lightcone/lib/api/v2/exchange-info";
import { getDeposits } from "loopring-lightcone/lib/api/v2/deposits";
import { getWithdrawals } from "loopring-lightcone/lib/api/v2/withdrawals";
import { getBalances } from "loopring-lightcone/lib/api/v2/balances";
import { getTokens } from "loopring-lightcone/lib/api/v2/tokens";
import { getTokensFiatPrice } from "loopring-lightcone/lib/api/v2/fiat-price";
import { getTransfers } from "loopring-lightcone/lib/api/v2/transfers";
import { getOnchainTokenAllowance } from "loopring-lightcone/lib/wallet";
import { getRecommendedGasPrice } from "loopring-lightcone/lib/api/v2/recommended-gas-price";
import { getEtherOnChainBalance } from "loopring-lightcone/lib/api/v2/ether-onchain-balance";
import { getEthereumTokenBalances } from "loopring-lightcone/lib/api/v2/ethereum-token-balances";
import { postTransfer } from "loopring-lightcone/lib/api/v2/transfers";
import {
    getSignedTransfer,
    generateKeyPair,
    setMaximumTokenApproval,
    deposit,
    withdraw,
    createAccount,
} from "loopring-lightcone/lib/wallet";
import { getApiSignature } from "loopring-lightcone/lib/signing/exchange";
import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { weiToEther, etherToWei } from "../../utils/conversion";
import { findTokenBySymbol } from "../../utils";

export const POST_GET_AUTH_STATUS_LOADING = "POST_GET_AUTH_STATUS_LOADING";
export const DELETE_GET_AUTH_STATUS_LOADING = "DELETE_GET_AUTH_STATUS_LOADING";
export const GET_AUTH_STATUS_SUCCESS = "GET_AUTH_STATUS_SUCCESS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const POST_GET_SUPPORTED_TOKENS_LOADING =
    "POST_GET_SUPPORTED_TOKENS_LOADING";
export const DELETE_GET_SUPPORTED_TOKENS_LOADING =
    "DELETE_GET_SUPPORTED_TOKENS_LOADING";
export const GET_SUPPORTED_TOKENS_SUCCESS = "GET_SUPPORTED_TOKENS_SUCCESS";
export const POST_GET_BALANCES_LOADING = "POST_GET_BALANCES_LOADING";
export const DELETE_GET_BALANCES_LOADING = "DELETE_GET_BALANCES_LOADING";
export const GET_BALANCES_SUCCESS = "GET_BALANCES_SUCCESS";
export const GET_TRANSACTIONS_SUCCESS = "GET_TRANSACTIONS_SUCCESS";
export const POST_TRANSACTIONS_LOADING = "POST_TRANSACTIONS_LOADING";
export const DELETE_TRANSACTIONS_LOADING = "DELETE_TRANSACTIONS_LOADING";
export const RESET_TRANSACTIONS = "RESET_TRANSACTIONS";
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
    "DELETE_DEPOSIT_TRANSACTION_HASH";
export const POST_SELECTED_ASSET = "POST_SELECTED_ASSET";
export const POST_WITHDRAWAL_SUCCESS = "POST_WITHDRAWAL_SUCCESS";
export const DELETE_WITHDRAWAL_TRANSACTION_HASH =
    "DELETE_WITHDRAWAL_TRANSACTION_HASH";
export const POST_SELECTED_FIAT = "POST_SELECTED_FIAT";
export const POST_LOGOUT = "POST_LOGOUT";
export const POST_REGISTRATION_SUCCESS = "POST_REGISTRATION_SUCCESS";
export const DELETE_REGISTRATION_SUCCESS_TRANSACTION_HASH =
    "DELETE_REGISTRATION_SUCCESS_TRANSACTION_HASH";

export const getAuthStatus = (address) => async (dispatch) => {
    try {
        dispatch({ type: POST_GET_AUTH_STATUS_LOADING });
        let needsRegistration = false;
        try {
            await getAccount(address);
        } catch (error) {
            needsRegistration = true;
        }
        dispatch({ type: GET_AUTH_STATUS_SUCCESS, needsRegistration });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.auth.status" />);
        console.error("error checking auth status", error);
    } finally {
        dispatch({ type: DELETE_GET_AUTH_STATUS_LOADING });
    }
};

export const login = (web3Instance, selectedAccount) => async (dispatch) => {
    try {
        // custom notification in case the account is not registered
        let account;
        try {
            account = await getAccount(selectedAccount);
        } catch (error) {
            toast.warn(<FormattedMessage id="warn.account.not.found" />);
            console.warn("account not found");
            return;
        }
        const exchange = await getExchangeInfo();
        const { exchangeAddress } = exchange;
        const { keyNonce, accountId } = account;
        let keys;
        try {
            keys = await generateKeyPair(
                web3Instance,
                exchangeAddress,
                selectedAccount,
                keyNonce
            );
        } catch (error) {
            console.error(
                "the user most probably rejected signing the required message",
                error
            );
            return;
        }
        if (!keys) {
            // the user most probably aborted the signing
            console.warn("The user aborted the signing process");
            return;
        }
        const { publicKeyX, publicKeyY, secretKey } = keys;
        if (
            account.publicKeyX !== publicKeyX ||
            account.publicKeyY !== publicKeyY
        ) {
            throw new Error(
                "api got and locally generated public keys don't match"
            );
        }
        const apiSignature = await getApiSignature(
            accountId,
            publicKeyX,
            publicKeyY,
            secretKey
        );
        const apiKey = await getApiKey(
            accountId,
            publicKeyX,
            publicKeyY,
            apiSignature
        );
        dispatch({
            type: LOGIN_SUCCESS,
            accountId,
            apiKey,
            apiSignature,
            exchange,
            keys,
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.initialization" />);
        console.error("error logging in", error);
    }
};

export const getSupportedTokens = () => async (dispatch) => {
    dispatch({ type: POST_GET_SUPPORTED_TOKENS_LOADING });
    try {
        dispatch({
            type: GET_SUPPORTED_TOKENS_SUCCESS,
            supportedTokens: await getTokens(),
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.supported.tokens" />);
        console.error("error getting rails' supported tokens", error);
    }
    dispatch({ type: DELETE_GET_SUPPORTED_TOKENS_LOADING });
};

export const getUserBalances = (
    web3Instance,
    accountId,
    apiKey,
    supportedTokens,
    selectedFiat
) => async (dispatch) => {
    dispatch({ type: POST_GET_BALANCES_LOADING });
    try {
        const partialBalances = await getBalances(accountId, apiKey);
        const fiatValues = await getTokensFiatPrice(selectedFiat.name);
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
                    (fiatValue) => fiatValue.symbol === supportedTokenSymbol
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
                    address: web3Instance.utils.toChecksumAddress(
                        supportedToken.address
                    ),
                    balance,
                    etherBalance: weiToEther(balance, supportedToken.decimals),
                    fiatValue,
                    depositEnabled: supportedToken.depositEnabled,
                    decimals: supportedToken.decimals,
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
        toast.error(<FormattedMessage id="error.rails.user.balances" />);
        console.error("error getting rails user balances", error);
    }
    dispatch({ type: DELETE_GET_BALANCES_LOADING });
};

export const getDepositBalance = (
    selectedAccount,
    tokenSymbol,
    supportedTokens
) => async (dispatch) => {
    try {
        let balance;
        if (tokenSymbol === "ETH") {
            balance = await getEtherOnChainBalance(selectedAccount);
        } else {
            const [tokenBalance] = await getEthereumTokenBalances(
                selectedAccount,
                tokenSymbol,
                supportedTokens
            );
            balance = tokenBalance;
        }
        dispatch({
            type: GET_DEPOSIT_BALANCE_SUCCESS,
            balance: new BigNumber(balance),
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.deposit.balance" />);
        console.error("error getting rails user balance", error);
    }
};

export const getTokenTransactions = (
    selectedAccount,
    accountId,
    apiKey,
    supportedTokens,
    page,
    itemsPerPage,
    type
) => async (dispatch) => {
    dispatch({ type: POST_TRANSACTIONS_LOADING });
    try {
        const now = Date.now();
        let transactions = [];
        let transactionsAmount = 0;
        const limit = (page + 1) * itemsPerPage;
        if (type === "all" || type === "transfers") {
            const transfers = await getTransfers(
                accountId,
                null,
                limit,
                0,
                apiKey,
                0,
                now
            );
            transactionsAmount += transfers.total;
            transactions = transactions.concat(
                transfers.transactions.map((transfer) => {
                    const bigNumberAmount = new BigNumber(transfer.amount);
                    const bigNumberFeeAmount = new BigNumber(
                        transfer.feeAmount
                    );
                    const { decimals } = findTokenBySymbol(
                        supportedTokens,
                        transfer.symbol
                    );
                    transfer.transfer = true;
                    transfer.amount = bigNumberAmount;
                    transfer.etherAmount = weiToEther(
                        bigNumberAmount,
                        decimals
                    );
                    transfer.feeAmount = bigNumberFeeAmount;
                    transfer.etherFeeAmount = weiToEther(
                        bigNumberFeeAmount,
                        decimals
                    );
                    transfer.sent =
                        selectedAccount.toLowerCase() ===
                        transfer.senderAddress.toLowerCase();
                    return transfer;
                })
            );
        }
        if (type === "all" || type === "deposits") {
            const deposits = await getDeposits(
                accountId,
                apiKey,
                0,
                now,
                false,
                null,
                0,
                limit
            );
            transactionsAmount += deposits.totalNum;
            transactions = transactions.concat(
                deposits.transactions.map((deposit) => {
                    const { decimals } = findTokenBySymbol(
                        supportedTokens,
                        deposit.symbol
                    );
                    const bigNumberAmount = new BigNumber(deposit.amount);
                    const bigNumberFeeAmount = new BigNumber(deposit.feeAmount);
                    deposit.deposit = true;
                    deposit.amount = bigNumberAmount;
                    deposit.etherAmount = weiToEther(bigNumberAmount, decimals);
                    deposit.feeAmount = bigNumberFeeAmount;
                    deposit.etherFeeAmount = weiToEther(bigNumberFeeAmount, 18);
                    return deposit;
                })
            );
        }
        if (type === "all" || type === "withdrawals") {
            const withdrawals = await getWithdrawals(
                accountId,
                apiKey,
                0,
                now,
                null,
                0,
                limit,
                null
            );
            transactionsAmount += withdrawals.totalNum;
            transactions = transactions.concat(
                withdrawals.transactions.map((withdrawal) => {
                    const { decimals } = findTokenBySymbol(
                        supportedTokens,
                        withdrawal.symbol
                    );
                    const bigNumberAmount = new BigNumber(withdrawal.amount);
                    const bigNumberFeeAmount = new BigNumber(
                        withdrawal.feeAmount
                    );
                    withdrawal.withdrawal = true;
                    withdrawal.amount = bigNumberAmount;
                    withdrawal.etherAmount = weiToEther(
                        bigNumberAmount,
                        decimals
                    );
                    withdrawal.feeAmount = bigNumberFeeAmount;
                    withdrawal.etherFeeAmount = weiToEther(
                        bigNumberFeeAmount,
                        18
                    );
                    return withdrawal;
                })
            );
        }
        dispatch({
            type: GET_TRANSACTIONS_SUCCESS,
            transactions: transactions
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, limit + 1),
            transactionsAmount,
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.token.transactions" />);
        console.error("error getting rails token transactions", error);
    } finally {
        dispatch({ type: DELETE_TRANSACTIONS_LOADING });
    }
};

export const resetTransactions = () => ({
    type: RESET_TRANSACTIONS,
});

export const submitTransfer = (
    web3Instance,
    selectedAccount,
    keys,
    apiKey,
    exchange,
    token,
    receiver,
    memo,
    amount
) => async (dispatch) => {
    dispatch({ type: POST_TRANSFER_LOADING });
    try {
        const {
            accountNonce: nonce,
            accountId: senderAccountId,
        } = await getAccount(selectedAccount);
        const { accountId: receiverAccountId } = await getAccount(receiver);
        const { exchangeId, transferFees } = exchange;
        let fee = "0";
        if (transferFees) {
            const wrappedTransferFee = transferFees.find(
                (fee) => fee.token === token.symbol
            );
            if (wrappedTransferFee) {
                fee = wrappedTransferFee.fee;
            }
        }
        const signedBundle = await getSignedTransfer(
            web3Instance,
            selectedAccount,
            keys.secretKey,
            token.id,
            token.id,
            etherToWei(new BigNumber(amount), token.decimals).toFixed(),
            fee,
            exchangeId,
            senderAccountId,
            receiverAccountId,
            1234,
            nonce,
            memo
        );
        if (!signedBundle) {
            // the user aborted the signing procedure
            return;
        }
        const { ecdsaSignature, signedTransfer } = signedBundle;
        const transferHash = await postTransfer(
            signedTransfer,
            ecdsaSignature,
            apiKey
        );
        toast.success(<FormattedMessage id="send.confirmation.ok" />);
        dispatch({ type: POST_TRANSFER_SUCCESS, hash: transferHash });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.transfer" />);
        console.error("error posting rails transfer", error);
    }
    dispatch({ type: DELETE_TRANSFER_LOADING });
};

export const deleteTransferHash = () => async (dispatch) => {
    dispatch({ type: DELETE_TRANSFER_HASH });
};

export const getTokenAllowance = (
    web3Instance,
    selectedAccount,
    exchange,
    token
) => async (dispatch) => {
    dispatch({ type: POST_GET_ALLOWANCE_LOADING });
    const { symbol, address } = token;
    try {
        const allowance = await getOnchainTokenAllowance(
            web3Instance,
            selectedAccount,
            address,
            exchange.exchangeAddress
        );
        dispatch({
            type: GET_ALLOWANCE_SUCCESS,
            token: symbol,
            allowance: new BigNumber(allowance),
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.token.allowance.get" />);
        console.error(`error getting token ${symbol} allowance`, error);
    }
    dispatch({ type: DELETE_GET_ALLOWANCE_LOADING });
};

export const grantAllowance = (
    web3Instance,
    selectedAccount,
    exchange,
    token
) => async (dispatch) => {
    dispatch({ type: POST_GRANT_ALLOWANCE_LOADING });
    try {
        const { exchangeAddress } = exchange;
        setMaximumTokenApproval(
            web3Instance,
            selectedAccount,
            token.address,
            exchangeAddress,
            await getRecommendedGasPrice()
        ).once("transactionHash", (transactionHash) => {
            dispatch({ type: GRANT_ALLOWANCE_SUCCESS, transactionHash });
        });
    } catch (error) {
        toast.error(
            <FormattedMessage id="error.rails.token.allowance.grant" />
        );
        console.error(`error requesting ${token.symbol} allowance`, error);
    }
    dispatch({ type: DELETE_GRANT_ALLOWANCE_LOADING });
};

export const deleteGrantAllowanceTransactionHash = () => async (dispatch) => {
    dispatch({ type: DELETE_GRANT_ALLOWANCE_TRANSACTION_HASH });
};

export const postDeposit = (
    web3Instance,
    selectedAccount,
    exchange,
    token,
    amount
) => async (dispatch) => {
    try {
        const { exchangeAddress } = exchange;
        deposit(
            web3Instance,
            selectedAccount,
            token,
            etherToWei(new BigNumber(amount), token.decimals).toFixed(),
            exchangeAddress,
            await getRecommendedGasPrice()
        ).once("transactionHash", (transactionHash) => {
            dispatch({ type: POST_DEPOSIT_SUCCESS, transactionHash });
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.deposit" />);
        console.error(`error depositing ${token.symbol}`, error);
    }
};

export const deleteDepositTransactionHash = () => async (dispatch) => {
    dispatch({ type: DELETE_DEPOSIT_TRANSACTION_HASH });
};

export const registerAccount = (web3Instance, selectedAccount) => async (
    dispatch
) => {
    try {
        try {
            if (await getAccount(selectedAccount)) {
                toast.warn(
                    <FormattedMessage id="warn.register.existing.account" />
                );
                console.warn("the account is already registered");
                return;
            }
        } catch (error) {
            // silently fail if the account is yet to be created
        }
        const { exchangeAddress } = await getExchangeInfo();
        const keys = await generateKeyPair(
            web3Instance,
            exchangeAddress,
            selectedAccount,
            0
        );
        if (!keys || !keys.secretKey) {
            throw new Error("failed to generate key pair");
        }
        const { publicKeyX, publicKeyY } = keys;
        createAccount(
            web3Instance,
            selectedAccount,
            publicKeyX,
            publicKeyY,
            "",
            exchangeAddress,
            await getRecommendedGasPrice()
        ).once("transactionHash", (transactionHash) => {
            dispatch({ type: POST_REGISTRATION_SUCCESS, transactionHash });
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.register" />);
        console.error("error registering user", error);
    }
};

export const deleteRegistrationTransactionHash = () => async (dispatch) => {
    dispatch({ type: DELETE_REGISTRATION_SUCCESS_TRANSACTION_HASH });
};

export const postSelectedAsset = (asset) => async (dispatch) => {
    dispatch({ type: POST_SELECTED_ASSET, asset });
};

export const postOnchainWithdrawal = (
    web3Instance,
    selectedAccount,
    exchange,
    token,
    amount
) => async (dispatch) => {
    try {
        const { exchangeAddress, onchainFees } = exchange;
        const wrappedFee = onchainFees.find((fee) => fee.type === "withdraw");
        withdraw(
            web3Instance,
            selectedAccount,
            token,
            etherToWei(new BigNumber(amount), token.decimals).toFixed(),
            wrappedFee.fee,
            exchangeAddress,
            await getRecommendedGasPrice()
        ).once("transactionHash", (transactionHash) => {
            dispatch({ type: POST_WITHDRAWAL_SUCCESS, transactionHash });
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.withdrawal" />);
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
