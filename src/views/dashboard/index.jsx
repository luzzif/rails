import React, { useCallback, useState, useEffect } from "react";
import { TransactionsContainer } from "./styled";
import { Send } from "./send/form";
import { Box, Flex } from "reflexbox";
import { Transactions } from "./transactions";
import { useSelector, useDispatch } from "react-redux";
import { ButtonsStrip } from "./buttons-strip";
import { Assets } from "./assets";
import {
    getTokenTransactions,
    deleteTransferHash,
    getUserBalances,
    postSelectedAsset,
    submitTransfer,
} from "../../actions/loopring";
import { TransactionSummary } from "./transaction-summary";
import { Summary } from "./summary";
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
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionsTypeFilter, setTransactionsTypeFilter] = useState(
        "transfers"
    );
    const [transactionsPage, setTransactionsPage] = useState(0);

    const handleTransactionsRefresh = useCallback(() => {
        if (accountId) {
            dispatch(
                getTokenTransactions(
                    ethereumAccount,
                    accountId,
                    apiKey,
                    supportedTokens,
                    transactionsPage,
                    5,
                    transactionsTypeFilter
                )
            );
            dispatch(
                getUserBalances(
                    web3Instance,
                    accountId,
                    apiKey,
                    supportedTokens,
                    selectedFiat
                )
            );
        }
    }, [
        accountId,
        apiKey,
        dispatch,
        ethereumAccount,
        selectedFiat,
        supportedTokens,
        transactionsTypeFilter,
        web3Instance,
        transactionsPage,
    ]);

    // getting transactions history
    useEffect(() => {
        handleTransactionsRefresh();
    }, [handleTransactionsRefresh]);

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

    const handleTransactionsPageChange = useCallback(
        (page) => {
            if (accountId) {
                dispatch(
                    getTokenTransactions(
                        ethereumAccount,
                        accountId,
                        apiKey,
                        supportedTokens,
                        page,
                        5,
                        transactionsTypeFilter
                    )
                );
                setTransactionsPage(page);
                dispatch(
                    getUserBalances(
                        web3Instance,
                        accountId,
                        apiKey,
                        supportedTokens,
                        selectedFiat
                    )
                );
            }
        },
        [
            accountId,
            apiKey,
            dispatch,
            ethereumAccount,
            selectedFiat,
            supportedTokens,
            transactionsTypeFilter,
            web3Instance,
        ]
    );

    const handleAssetsRefresh = useCallback(() => {
        dispatch(
            getUserBalances(
                web3Instance,
                accountId,
                apiKey,
                supportedTokens,
                selectedFiat
            )
        );
    }, [
        accountId,
        apiKey,
        dispatch,
        selectedFiat,
        supportedTokens,
        web3Instance,
    ]);

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
            dispatch(deleteTransferHash());
            dispatch(getTokenTransactions);
            handleClose();
        }
    }, [dispatch, handleClose, successfulTransferHash]);

    const handleDeposit = useCallback(() => {
        setDepositing(true);
    }, []);

    const handleWithdraw = useCallback(() => {
        setWithdrawing(true);
    }, []);

    const handleTypeFilterChange = useCallback(
        (filter) => {
            if (accountId) {
                dispatch(
                    getTokenTransactions(
                        ethereumAccount,
                        accountId,
                        apiKey,
                        supportedTokens,
                        transactionsPage,
                        5,
                        filter
                    )
                );
                setTransactionsPage(transactionsPage);
                setTransactionsTypeFilter(filter);
                dispatch(
                    getUserBalances(
                        web3Instance,
                        accountId,
                        apiKey,
                        supportedTokens,
                        selectedFiat
                    )
                );
            }
        },
        [
            accountId,
            apiKey,
            dispatch,
            ethereumAccount,
            selectedFiat,
            supportedTokens,
            transactionsPage,
            web3Instance,
        ]
    );

    return (
        <>
            <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
            >
                <Box mb="16px" mt={["24px"]}>
                    <Summary
                        etherBalance={selectedAsset.etherBalance}
                        symbol={selectedAsset.symbol}
                        fiatValue={selectedAsset.fiatValue}
                        selectedFiat={selectedFiat}
                    />
                </Box>
                <Box mb="16px" width={["85%", "60%", "50%", "45%"]}>
                    <ButtonsStrip
                        onSend={handleSend}
                        onDeposit={handleDeposit}
                        onAssets={handleAssets}
                        onWithdraw={handleWithdraw}
                        asset={selectedAsset}
                    />
                </Box>
                <TransactionsContainer width={["93%", "75%", "65%", "45%"]}>
                    <Transactions
                        balances={balances}
                        transactions={transactions}
                        loading={balancesLoading || transactionsLoading}
                        typeFilter={transactionsTypeFilter}
                        onChange={handleTransactionChange}
                        onTypeFilterChange={handleTypeFilterChange}
                        onRefresh={handleTransactionsRefresh}
                        selectedFiat={selectedFiat}
                        onPageChange={handleTransactionsPageChange}
                        page={transactionsPage}
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
                <Send
                    asset={selectedAsset}
                    onConfirm={handleSendConfirm}
                    exchange={exchange}
                />
            </BottomUpContainer>
            <BottomUpContainer open={showingTransaction} onClose={handleClose}>
                <TransactionSummary transaction={selectedTransaction} />
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
