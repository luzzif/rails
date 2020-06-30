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
        selectedFiat,
    } = useSelector((state) => ({
        account: state.loopring.account,
        wallet: state.loopring.wallet,
        exchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens.data,
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
    const [transactionsTypeFilter, setTransactionsTypeFilter] = useState("all");

    // getting transactions history (deposits, transfers and withdrawals)
    useEffect(() => {
        // if a logout happens, loopring's state will be wiped clean. Since the
        // dashboard updates before the app component (which is the one that
        // really knows if a user logged out or not), we need to check if
        // the account is still there
        if (account && transactionsTypeFilter) {
            dispatch(
                getTokenTransactions(
                    account,
                    wallet,
                    selectedAsset.symbol,
                    supportedTokens,
                    10,
                    transactionsTypeFilter
                )
            );
        }
    }, [
        account,
        balances,
        dispatch,
        selectedAsset,
        supportedTokens,
        transactionsTypeFilter,
        wallet,
    ]);

    // when balances change (for example on selected fiat change, the selected asset has to be updated)
    useEffect(() => {
        if (balances) {
            dispatch(
                postSelectedAsset(
                    balances.find((balance) => balance.id === selectedAsset.id)
                )
            );
        }
    }, [balances, dispatch, selectedAsset]);

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
                10,
                transactionsTypeFilter
            )
        );
        // we also refresh the summarized balance in order
        // to avoid inconsistencies
        dispatch(
            getUserBalances(account, wallet, supportedTokens, selectedFiat)
        );
    }, [
        account,
        dispatch,
        selectedAsset,
        selectedFiat,
        supportedTokens,
        transactionsTypeFilter,
        wallet,
    ]);

    const handleAssetsRefresh = useCallback(() => {
        dispatch(
            getUserBalances(account, wallet, supportedTokens, selectedFiat)
        );
    }, [account, dispatch, selectedFiat, supportedTokens, wallet]);

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

    const handleTransferConfirmationClose = useCallback(() => {
        handleTransactionsRefresh();
        handleClose();
    }, [handleClose, handleTransactionsRefresh]);

    return (
        <>
            <Flex
                flexDirection="column"
                alignItems="center"
                height="100%"
                pt={72}
            >
                <Box mb={3}>
                    <Summary
                        balance={selectedAsset.balance}
                        symbol={selectedAsset.symbol}
                        fiatValue={selectedAsset.fiatValue}
                        selectedFiat={selectedFiat}
                    />
                </Box>
                <Box mb={3} width={["85%", "60%", "50%", "45%"]}>
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
                    width={["93%", "75%", "65%", "45%"]}
                >
                    <Transactions
                        asset={selectedAsset}
                        transactions={transactions}
                        loading={transactionsLoading}
                        typeFilter={transactionsTypeFilter}
                        onChange={handleTransactionChange}
                        onTypeFilterChange={setTransactionsTypeFilter}
                        onRefresh={handleTransactionsRefresh}
                        selectedFiat={selectedFiat}
                    />
                </TransactionsContainer>
            </Flex>
            <BottomUpContainer open={changingAsset} onClose={handleClose}>
                <Assets
                    assets={balances}
                    onChange={handleAssetChange}
                    open={changingAsset}
                    onRefresh={handleAssetsRefresh}
                    selectedFiat={selectedFiat}
                />
            </BottomUpContainer>
            <BottomUpContainer open={sending} onClose={handleClose}>
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
                        <Confirmation
                            onClose={handleTransferConfirmationClose}
                        />
                    </SwipeableViews>
                )}
            </BottomUpContainer>
            <BottomUpContainer open={showingTransaction} onClose={handleClose}>
                {showingTransaction && (
                    <TransactionSummary {...selectedTransaction} />
                )}
            </BottomUpContainer>
            <BottomUpContainer open={depositing} onClose={handleClose}>
                <DepositFlow open={depositing} asset={selectedAsset} />
            </BottomUpContainer>
            <BottomUpContainer open={withdrawing} onClose={handleClose}>
                <WithdrawalFlow open={withdrawing} asset={selectedAsset} />
            </BottomUpContainer>
        </>
    );
};
