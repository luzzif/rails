import React, { useCallback, useState, useRef, useEffect } from "react";
import { BottomUpContainer, Overlay, TransactionsContainer } from "./styled";
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
} from "../../actions/loopring";
import { TransactionSummary } from "./transaction-summary";
import { Summary } from "../dashboard/summary";
import { Confirmation } from "./send/confirmation";
import { DepositFlow } from "./deposit";

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
    } = useSelector((state) => ({
        account: state.loopring.account,
        wallet: state.loopring.wallet,
        exchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens,
        balances: state.loopring.balances.data,
        transactions: state.loopring.transactions.data,
        transactionsLoading: !!state.loopring.transactions.loadings,
        successfulTransferHash: state.loopring.successfulTransferHash,
    }));
    const bottomUpContainer = useRef(null);
    const dispatch = useDispatch();
    const [sending, setSending] = useState(false);
    const [changingAsset, setChangingAsset] = useState(false);
    const [showingTransaction, setShowingTransaction] = useState(false);
    const [depositing, setDepositing] = useState(false);
    const [sendIndex, setSendIndex] = useState(0);
    const [selectedAsset, setSelectedAsset] = useState(balances[0]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // setting the selected asset
    useEffect(() => {
        const firstNonZeroBalance = balances.find(
            (balance) => !balance.balance.isZero()
        );
        setSelectedAsset(firstNonZeroBalance || balances[0]);
    }, [balances, supportedTokens]);

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
    }, [
        account,
        balances,
        dispatch,
        selectedAsset.symbol,
        supportedTokens,
        wallet,
    ]);

    const handleClose = useCallback(() => {
        setSending(false);
        setChangingAsset(false);
        setShowingTransaction(false);
        setDepositing(false);
        setSendIndex(0);
    }, []);

    const handleClick = useCallback(
        (event) => {
            if (bottomUpContainer.current.contains(event.target)) {
                return;
            }
            handleClose();
        },
        [handleClose]
    );

    // hiding the bottom up container on outside click
    // (only active if the container is actually shown)
    useEffect(() => {
        if (sending || changingAsset || showingTransaction || depositing) {
            document.addEventListener("mousedown", handleClick);
            return () => {
                document.removeEventListener("mousedown", handleClick);
            };
        }
    }, [handleClick, sending, changingAsset, showingTransaction, depositing]);

    const handleAssets = useCallback(() => {
        setChangingAsset(true);
    }, []);

    const handleAssetChange = useCallback((asset) => {
        setSelectedAsset(asset);
        setChangingAsset(false);
    }, []);

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
        [
            account,
            dispatch,
            exchange,
            selectedAsset.symbol,
            supportedTokens,
            wallet,
        ]
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
                    />
                </Box>
                <Box mb={3} width={["85%", "60%", "50%", "40%", "30%"]}>
                    <ButtonsStrip
                        onSend={handleSend}
                        onDeposit={handleDeposit}
                        onAssets={handleAssets}
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
                    />
                </TransactionsContainer>
            </Flex>
            <Overlay
                show={
                    sending || changingAsset || showingTransaction || depositing
                }
            />
            <BottomUpContainer
                m="0 auto"
                width={["95%", "75%", "65%", "45%", "35%"]}
                show={
                    sending || changingAsset || showingTransaction || depositing
                }
                ref={bottomUpContainer}
            >
                {changingAsset && (
                    <Assets
                        assets={balances}
                        onChange={handleAssetChange}
                        open={changingAsset}
                        onRefresh={handleAssetsRefresh}
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
            </BottomUpContainer>
        </>
    );
};
