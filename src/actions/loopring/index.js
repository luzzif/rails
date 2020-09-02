import React from "react";
import { getLoopringApiKey } from "../../utils/loopring";
import Wallet from "../../lightcone/wallet";
import { getAccount } from "loopring-lightcone/lib/api/v2/account";
import { getExchangeInfo } from "loopring-lightcone/lib/api/v2/exchange-info";
import { getDeposits } from "loopring-lightcone/lib/api/v2/deposits";
import { getWithdrawalHistory } from "../../lightcone/api/LightconeAPI";
import { getBalances } from "../../lightcone/api/v1/balances/get";
import { getTokenInfo } from "../../lightcone/api/v1/tokeninfo/get";
import { getPrice } from "../../lightcone/api/v1/price/get";
import BigNumber from "bignumber.js";
import { getTransferHistory } from "../../lightcone/api/v1/transfer/get";
import config from "../../lightcone/config";
import { submitTransfer } from "../../lightcone/api/v1/transfer";
import { getAllowance } from "../../lightcone/api/v1/allowances/get";
import { getRecommendedGasPrice } from "../../lightcone/api/v1/recommendedGasPrice/get";
import { getEthNonce } from "../../lightcone/api/v1/ethnonce/get";
import { getTokenBalance } from "../../lightcone/api/v1/tokenBalance/get";
import { getEthBalance } from "../../lightcone/api/v1/ethBalance/get";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { weiToEther } from "../../utils/conversion";

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
    "DELETE_DEPOSIT_TRANSACTION_HASHPOST_DEPOSIT_SUCCESS";
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
        const wallet = new Wallet("MetaMask", web3Instance, selectedAccount);
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
        const { keyPair } = await wallet.generateKeyPair(
            exchangeAddress,
            account.keyNonce
        );
        if (!keyPair) {
            // the user most probably aborted the signing
            console.warn("The user aborted the signing process");
            return;
        }
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
        dispatch({ type: LOGIN_SUCCESS, account, wallet, exchange });
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
            supportedTokens: await getTokenInfo(),
        });
    } catch (error) {
        toast.error(<FormattedMessage id="error.rails.supported.tokens" />);
        console.error("error getting rails' supported tokens", error);
    }
    dispatch({ type: DELETE_GET_SUPPORTED_TOKENS_LOADING });
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
                    address: supportedToken.address,
                    balance,
                    etherBalance: weiToEther(
                        balance,
                        supportedTokenId,
                        supportedTokens
                    ),
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
        toast.error(<FormattedMessage id="error.rails.user.balances" />);
        console.error("error getting rails user balances", error);
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
        toast.error(<FormattedMessage id="error.rails.deposit.balance" />);
        console.error("error getting rails user balance", error);
    }
};

// FIXME: not particularly efficient (every time we fetch the whole transactions list anew)
export const getTokenTransactions = (
    account,
    wallet,
    tokenSymbol,
    supportedTokens,
    page,
    itemsPerPage,
    type
) => async (dispatch) => {
    dispatch({ type: POST_TRANSACTIONS_LOADING });
    try {
        const apiKey = await getLoopringApiKey(wallet, account);
        let transactions = [];
        let transactionsAmount = 0;
        const offset = page * itemsPerPage;
        if (type === "all" || type === "transfers") {
            const transfers = await getTransferHistory(
                account.accountId,
                tokenSymbol,
                itemsPerPage,
                offset,
                apiKey,
                supportedTokens
            );
            transactionsAmount += transfers.totalNum;
            transactions = transactions.concat(
                transfers.transactions.map((transfer) => {
                    const bigNumberAmount = new BigNumber(transfer.amount);
                    const bigNumberFeeAmount = new BigNumber(
                        transfer.feeAmount
                    );
                    transfer.transfer = true;
                    transfer.amount = bigNumberAmount;
                    transfer.etherAmount = weiToEther(
                        bigNumberAmount,
                        transfer.symbol,
                        supportedTokens
                    );
                    transfer.feeAmount = bigNumberFeeAmount;
                    transfer.etherFeeAmount = weiToEther(
                        bigNumberFeeAmount,
                        transfer.symbol,
                        supportedTokens
                    );
                    transfer.sent =
                        wallet.address.toLowerCase() ===
                        transfer.senderAddress.toLowerCase();
                    return transfer;
                })
            );
        }
        if (type === "all" || type === "deposits") {
            const deposits = await getDeposits(
                account.accountId,
                apiKey,
                null,
                null,
                false,
                null,
                offset,
                itemsPerPage,
                null,
                tokenSymbol
            );
            transactionsAmount += deposits.totalNum;
            transactions = transactions.concat(
                deposits.transactions.map((deposit) => {
                    const bigNumberAmount = new BigNumber(deposit.amount);
                    const bigNumberFeeAmount = new BigNumber(deposit.feeAmount);
                    deposit.deposit = true;
                    deposit.amount = bigNumberAmount;
                    deposit.etherAmount = weiToEther(
                        bigNumberAmount,
                        deposit.symbol,
                        supportedTokens
                    );
                    deposit.feeAmount = bigNumberFeeAmount;
                    deposit.etherFeeAmount = weiToEther(
                        bigNumberFeeAmount,
                        "ETH",
                        supportedTokens
                    );
                    return deposit;
                })
            );
        }
        if (type === "all" || type === "withdrawals") {
            const withdrawals = await getWithdrawalHistory(
                account.accountId,
                tokenSymbol,
                itemsPerPage,
                offset,
                apiKey,
                supportedTokens
            );
            transactionsAmount += withdrawals.totalNum;
            transactions = transactions.concat(
                withdrawals.transactions.map((withdrawal) => {
                    const bigNumberAmount = new BigNumber(withdrawal.amount);
                    const bigNumberFeeAmount = new BigNumber(
                        withdrawal.feeAmount
                    );
                    withdrawal.withdrawal = true;
                    withdrawal.amount = bigNumberAmount;
                    withdrawal.etherAmount = weiToEther(
                        bigNumberAmount,
                        withdrawal.symbol,
                        supportedTokens
                    );
                    withdrawal.feeAmount = bigNumberFeeAmount;
                    withdrawal.etherFeeAmount = weiToEther(
                        bigNumberFeeAmount,
                        "ETH",
                        supportedTokens
                    );
                    return withdrawal;
                })
            );
        }
        dispatch({
            type: GET_TRANSACTIONS_SUCCESS,
            transactions: transactions.slice(0, itemsPerPage + 1),
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
        const { accountNonce: nonce } = await getAccount(wallet.address);
        const { accountId: receiverAccountId } = await getAccount(receiver);
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
        const signedData = await wallet.signTransfer(
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
        if (!signedData) {
            // the user aborted the signing procedure
            return;
        }
        const { transfer, ecdsaSig } = signedData;
        const transferHash = await submitTransfer(
            transfer,
            ecdsaSig,
            await getLoopringApiKey(wallet, account)
        );
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
        toast.error(<FormattedMessage id="error.rails.token.allowance.get" />);
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
        const { accountNonce: nonce } = await getAccount(wallet.address);
        const { chainId, exchangeAddress } = exchange;
        const transactionHash = await wallet.approveMax(
            tokenAddress,
            exchangeAddress,
            chainId,
            nonce,
            await getRecommendedGasPrice(),
            true
        );
        dispatch({ type: GRANT_ALLOWANCE_SUCCESS, transactionHash });
    } catch (error) {
        toast.error(
            <FormattedMessage id="error.rails.token.allowance.grant" />
        );
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
        toast.error(<FormattedMessage id="error.rails.deposit" />);
        console.error(`error depositing ${tokenSymbol}`, error);
    }
};

export const deleteDepositTransactionHash = () => async (dispatch) => {
    dispatch({ type: DELETE_DEPOSIT_TRANSACTION_HASH });
};

export const registerAccount = (web3Instance) => async (dispatch) => {
    try {
        const accounts = await web3Instance.eth.getAccounts();
        const selectedAccount = accounts[0];
        const wallet = new Wallet("MetaMask", web3Instance, selectedAccount);
        try {
            if (await getAccount(wallet.address)) {
                toast.warn(
                    <FormattedMessage id="warn.register.existing.account" />
                );
                console.warn("the account is already registered");
                return;
            }
        } catch (error) {
            // silently fail if the account is yet to be created
        }
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
        const txHash = await wallet.createOrUpdateAccount(
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
        dispatch({ type: POST_REGISTRATION_SUCCESS, transactionHash: txHash });
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
