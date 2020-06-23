import React, { useCallback, useState, useEffect } from "react";
import { TransactionsContainer } from "./styled";
import { Send } from "./send/form";
import { Box, Flex } from "reflexbox";
import { Transactions } from "./transactions";
import { useSelector, useDispatch } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { ButtonsStrip } from "./buttons-strip";
import { Assets } from "./assets";
import {
    getTokenTransactions,
    postTransfer,
    deleteTransferHash,
    getUserBalances,
    postSelectedAsset,
} from "../../actions/loopring";
import { TransactionSummary } from "./transaction-summary";
import { Summary } from "../dashboard/summary";
import { Confirmation } from "./send/confirmation";
import { DepositFlow } from "./deposit";
import { WithdrawalFlow } from "./withdraw";
import { BottomUpContainer } from "../../components/bottom-up-container";

export const Dashboard = () => {
    const {
        account,
        wallet,
        exchange,
        supportedTokens,
        balances,
        transactions,
        transactionsLoading,
        successfulTransferHash,
        selectedAsset,
        selectedFiat
    } = useSelector((state) => ({
        account: state.loopring.account,
        wallet: state.loopring.wallet,
        exchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens,
        balances: state.loopring.balances.data,
        transactions: state.loopring.transactions.data,
        transactionsLoading: !!state.loopring.transactions.loadings,
        successfulTransferHash: state.loopring.successfulTransferHash,
        selectedAsset: state.loopring.selectedAsset,
        selectedFiat: state.loopring.selectedFiat,
    }));
    const dispatch = useDispatch();
    const [sending, setSending] = useState(false);
    const [changingAsset, setChangingAsset] = useState(false);
    const [showingTransaction, setShowingTransaction] = useState(false);
    const [depositing, setDepositing] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [sendIndex, setSendIndex] = useState(0);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // getting transactions history (deposits, transfers and withdrawals)
    useEffect(() => {
        dispatch(
            getTokenTransactions(
                account,
                wallet,
                selectedAsset.symbol,
                supportedTokens
            )
        );
    }, [account, balances, dispatch, selectedAsset, supportedTokens, wallet]);

    const handleClose = useCallback(() => {
        setSending(false);
        setChangingAsset(false);
        setShowingTransaction(false);
        setDepositing(false);
        setWithdrawing(false);
        setSendIndex(0);
    }, []);

    const handleAssets = useCallback(() => {
        setChangingAsset(true);
    }, []);

    const handleAssetChange = useCallback(
        (asset) => {
            dispatch(postSelectedAsset(asset));
            setChangingAsset(false);
        },
        [dispatch]
    );

    const handleTransactionChange = useCallback((transaction) => {
        setSelectedTransaction(transaction);
        setShowingTransaction(true);
    }, []);

    const handleTransactionsRefresh = useCallback(() => {
        dispatch(
            getTokenTransactions(
                account,
                wallet,
                selectedAsset.symbol,
                supportedTokens,
                10
            )
        );
        // we also refresh the summarized balance in order
        // to avoid inconsistencies
        dispatch(getUserBalances(account, wallet, supportedTokens));
    }, [account, dispatch, selectedAsset, supportedTokens, wallet]);

    const handleAssetsRefresh = useCallback(() => {
        dispatch(getUserBalances(account, wallet, supportedTokens));
    }, [account, dispatch, supportedTokens, wallet]);

    const handleSend = useCallback(() => {
        setSending(true);
    }, []);

    const handleSendConfirm = useCallback(
        (resolvedReceived, amount, memo) => {
            dispatch(
                postTransfer(
                    account,
                    wallet,
                    exchange,
                    selectedAsset.symbol,
                    resolvedReceived,
                    memo,
                    amount,
                    supportedTokens
                )
            );
        },
        [account, dispatch, exchange, selectedAsset, supportedTokens, wallet]
    );

    // on a succesful transfer, we set the correct index and delete the hash
    useEffect(() => {
        if (successfulTransferHash) {
            setSendIndex(1);
            dispatch(deleteTransferHash());
        }
    }, [dispatch, successfulTransferHash]);

    const handleDeposit = useCallback(() => {
        setDepositing(true);
    }, []);

    const handleWithdraw = useCallback(() => {
        setWithdrawing(true);
    }, []);

    return (
        <>
            <Flex
                flexDirection="column"
                alignItems="center"
                height="100%"
                pt={80}
            >
                <Box mb={3}>
                    <Summary
                        balance={selectedAsset.balance}
                        symbol={selectedAsset.symbol}
                        fiatValue={selectedAsset.fiatValue}
                        selectedFiat={selectedFiat}
                    />
                </Box>
                <Box mb={3} width={["85%", "60%", "50%", "40%", "30%"]}>
                    <ButtonsStrip
                        onSend={handleSend}
                        onDeposit={handleDeposit}
                        onAssets={handleAssets}
                        onWithdraw={handleWithdraw}
                        asset={selectedAsset}
                    />
                </Box>
                <TransactionsContainer
                    flexGrow={1}
                    width={["93%", "75%", "65%", "45%", "35%"]}
                >
                    <Transactions
                        asset={selectedAsset}
                        transactions={transactions}
                        loading={transactionsLoading}
                        onChange={handleTransactionChange}
                        onRefresh={handleTransactionsRefresh}
                        selectedFiat={selectedFiat}
                    />
                </TransactionsContainer>
            </Flex>
            <BottomUpContainer
                width={["95%", "75%", "65%", "45%", "35%"]}
                open={
                    sending ||
                    changingAsset ||
                    showingTransaction ||
                    depositing ||
                    withdrawing
                }
                onClose={handleClose}
            >
                {changingAsset && (
                    <Assets
                        assets={balances}
                        onChange={handleAssetChange}
                        open={changingAsset}
                        onRefresh={handleAssetsRefresh}
                        selectedFiat={selectedFiat}
                    />
                )}
                {sending && (
                    <SwipeableViews
                        index={sendIndex}
                        disabled
                        style={{ overflowY: "hidden", width: "100%" }}
                    >
                        <Send
                            asset={selectedAsset}
                            onConfirm={handleSendConfirm}
                        />
                        <Confirmation onClose={handleClose} />
                    </SwipeableViews>
                )}
                {showingTransaction && (
                    <TransactionSummary {...selectedTransaction} />
                )}
                {depositing && (
                    <DepositFlow open={depositing} asset={selectedAsset} />
                )}
                {withdrawing && (
                    <WithdrawalFlow open={withdrawing} asset={selectedAsset} />
                )}
            </BottomUpContainer>
        </>
    );
};
