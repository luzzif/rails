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
    deleteTransferHash,
    getUserBalances,
    postSelectedAsset,
    resetTransactions,
    submitTransfer,
} from "../../actions/loopring";
import { TransactionSummary } from "./transaction-summary";
import { Summary } from "../dashboard/summary";
import { Confirmation } from "./send/confirmation";
import { DepositFlow } from "./deposit";
import { WithdrawalFlow } from "./withdraw";
import { BottomUpContainer } from "../../components/bottom-up-container";

const Dashboard = () => {
    const {
        keys,
        web3Instance,
        ethereumAccount,
        accountId,
        apiKey,
        exchange,
        supportedTokens,
        balances,
        balancesLoading,
        transactions,
        transactionsLoading,
        transactionsAmount,
        successfulTransferHash,
        selectedAsset,
        selectedFiat,
    } = useSelector((state) => ({
        keys: state.loopring.keys,
        web3Instance: state.web3.instance,
        ethereumAccount: state.web3.selectedAccount,
        accountId: state.loopring.accountId,
        apiKey: state.loopring.apiKey,
        exchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens.data,
        balances: state.loopring.balances.data,
        balancesLoading: !!state.loopring.balances.loadings,
        transactions: state.loopring.transactions.data,
        transactionsLoading: !!state.loopring.transactions.loadings,
        transactionsAmount: state.loopring.transactions.amounts,
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
        if (
            accountId &&
            apiKey &&
            selectedAsset &&
            supportedTokens &&
            supportedTokens.length > 0 &&
            transactionsTypeFilter
        ) {
            dispatch(
                getTokenTransactions(
                    ethereumAccount,
                    accountId,
                    apiKey,
                    selectedAsset,
                    0,
                    10,
                    transactionsTypeFilter
                )
            );
        }
    }, [
        accountId,
        apiKey,
        dispatch,
        ethereumAccount,
        selectedAsset,
        supportedTokens,
        transactionsTypeFilter,
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
            dispatch(resetTransactions());
            setChangingAsset(false);
        },
        [dispatch]
    );

    const handleTransactionChange = useCallback((transaction) => {
        setSelectedTransaction(transaction);
        setShowingTransaction(true);
    }, []);

    const handleTransactionsRefresh = useCallback(() => {
        dispatch(resetTransactions());
        dispatch(
            getUserBalances(accountId, apiKey, supportedTokens, selectedFiat)
        );
    }, [accountId, apiKey, dispatch, selectedFiat, supportedTokens]);

    const handleTransactionsLoad = useCallback(
        (page) => {
            dispatch(
                getTokenTransactions(
                    ethereumAccount,
                    accountId,
                    apiKey,
                    selectedAsset,
                    page,
                    10,
                    transactionsTypeFilter
                )
            );
        },
        [
            accountId,
            apiKey,
            dispatch,
            ethereumAccount,
            selectedAsset,
            transactionsTypeFilter,
        ]
    );

    const handleAssetsRefresh = useCallback(() => {
        dispatch(
            getUserBalances(accountId, apiKey, supportedTokens, selectedFiat)
        );
    }, [accountId, apiKey, dispatch, selectedFiat, supportedTokens]);

    const handleSend = useCallback(() => {
        setSending(true);
    }, []);

    const handleSendConfirm = useCallback(
        (resolvedReceived, amount, memo) => {
            dispatch(
                submitTransfer(
                    web3Instance,
                    ethereumAccount,
                    keys,
                    apiKey,
                    exchange,
                    selectedAsset,
                    resolvedReceived,
                    memo,
                    amount
                )
            );
        },
        [
            apiKey,
            dispatch,
            ethereumAccount,
            exchange,
            keys,
            selectedAsset,
            web3Instance,
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

    const handleWithdraw = useCallback(() => {
        setWithdrawing(true);
    }, []);

    const handleTransferConfirmationClose = useCallback(() => {
        handleTransactionsRefresh();
        handleClose();
    }, [handleClose, handleTransactionsRefresh]);

    const handleTypeFilterChange = useCallback(
        (filter) => {
            dispatch(resetTransactions());
            setTransactionsTypeFilter(filter);
        },
        [dispatch]
    );

    return (
        <>
            <Flex
                flexDirection="column"
                alignItems="center"
                height="100%"
                pt={72}
            >
                <Box mb="24px">
                    <Summary
                        etherBalance={selectedAsset.etherBalance}
                        symbol={selectedAsset.symbol}
                        fiatValue={selectedAsset.fiatValue}
                        selectedFiat={selectedFiat}
                    />
                </Box>
                <Box mb="24px" width={["85%", "60%", "50%", "45%"]}>
                    <ButtonsStrip
                        onSend={handleSend}
                        onDeposit={handleDeposit}
                        onAssets={handleAssets}
                        onWithdraw={handleWithdraw}
                        asset={selectedAsset}
                    />
                </Box>
                <TransactionsContainer
                    flexGrow="1"
                    width={["93%", "75%", "65%", "45%"]}
                >
                    <Transactions
                        asset={selectedAsset}
                        transactions={transactions}
                        loading={balancesLoading || transactionsLoading}
                        typeFilter={transactionsTypeFilter}
                        onChange={handleTransactionChange}
                        onTypeFilterChange={handleTypeFilterChange}
                        onRefresh={handleTransactionsRefresh}
                        selectedFiat={selectedFiat}
                        onLoadTransactions={handleTransactionsLoad}
                        transactionsLoading={transactionsLoading}
                        transactionsAmount={transactionsAmount}
                    />
                </TransactionsContainer>
            </Flex>
            <BottomUpContainer
                noBottomPadding
                open={changingAsset}
                onClose={handleClose}
            >
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

export default Dashboard;
