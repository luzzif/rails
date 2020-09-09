import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { Transaction } from "./transaction";
import { FormattedMessage, useIntl } from "react-intl";
import { Searchbar } from "../../../components/searchbar";
import { ActionButton } from "../../../components/action-button";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { ListFlex, RootFlex, StyledInfiniteScroll } from "./styled";
import { Chip } from "../../../components/chip";
import { LoadingOverlay } from "../../../components/loading-overlay";
import { useRef } from "react";

export const Transactions = ({
    balances,
    transactions,
    loading,
    onChange,
    typeFilter,
    onTypeFilterChange,
    onRefresh,
    selectedFiat,
    onLoadTransactions,
    transactionsLoading,
    transactionsAmount,
}) => {
    const { formatMessage } = useIntl();

    const scrollParentRef = useRef(null);
    const [query, setQuery] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState(
        transactions
    );
    const [hasMoreTransactions, setHasMoreTransactions] = useState(false);

    useEffect(() => {
        setHasMoreTransactions(
            !query &&
                !transactionsLoading &&
                transactions.length < transactionsAmount
        );
    }, [transactionsLoading, query, transactions.length, transactionsAmount]);

    useEffect(() => {
        setFilteredTransactions(
            !transactions
                ? transactions
                : transactions.filter((transaction) => {
                      const lowerCasedSearchTerm = query.trim().toLowerCase();
                      if (transaction.transfer) {
                          return transaction.memo
                              .toLowerCase()
                              .includes(lowerCasedSearchTerm);
                      }
                      if (transaction.deposit) {
                          return formatMessage({
                              id: "dashboard.transactions.deposit",
                          })
                              .toLowerCase()
                              .includes(lowerCasedSearchTerm);
                      }
                      if (transaction.withdrawal) {
                          return formatMessage({
                              id: "dashboard.transactions.withdrawal",
                          })
                              .toLowerCase()
                              .includes(lowerCasedSearchTerm);
                      }
                      return false;
                  })
        );
    }, [formatMessage, query, transactions]);

    const handleSearchbarChange = useCallback((event) => {
        setQuery(event.target.value);
    }, []);

    const handleRefresh = useCallback(() => {
        onRefresh();
    }, [onRefresh]);

    const handleAllChipClick = useCallback(() => {
        onTypeFilterChange("all");
    }, [onTypeFilterChange]);

    const handleDepositsChipClick = useCallback(() => {
        onTypeFilterChange("deposits");
    }, [onTypeFilterChange]);

    const handleWithdrawalsChipClick = useCallback(() => {
        onTypeFilterChange("withdrawals");
    }, [onTypeFilterChange]);

    const handleTransfersChipClick = useCallback(() => {
        onTypeFilterChange("transfers");
    }, [onTypeFilterChange]);

    const handleGetScrollParent = useCallback(() => scrollParentRef.current, [
        scrollParentRef,
    ]);

    return (
        <RootFlex
            width="100%"
            height="100%"
            flexDirection="column"
            alignItems="center"
            px="16px"
            pt="16px"
        >
            <Flex width="100%" mb="12px">
                <Box pr="16px" width="100%">
                    <Searchbar
                        dark
                        placeholder={formatMessage({
                            id: "dashboard.transactions.search.placeholder",
                        })}
                        value={query}
                        onChange={handleSearchbarChange}
                    />
                </Box>
                <Box minWidth="auto" height={36}>
                    <ActionButton
                        faIcon={faRedo}
                        size={44}
                        faIconSize={20}
                        dark
                        onClick={handleRefresh}
                    />
                </Box>
            </Flex>
            <Flex
                mb="8px"
                flexWrap="nowrap"
                width="100%"
                overflowX="auto"
                minHeight={36}
            >
                <Box mr={12} minWidth="auto">
                    <Chip
                        dark
                        onClick={handleAllChipClick}
                        active={typeFilter === "all"}
                    >
                        <FormattedMessage id="dashboard.transactions.chip.all" />
                    </Chip>
                </Box>
                <Box mr={12} minWidth="auto">
                    <Chip
                        dark
                        onClick={handleDepositsChipClick}
                        active={typeFilter === "deposits"}
                    >
                        <FormattedMessage id="dashboard.transactions.chip.deposits" />
                    </Chip>
                </Box>
                <Box mr={12} minWidth="auto">
                    <Chip
                        dark
                        onClick={handleWithdrawalsChipClick}
                        active={typeFilter === "withdrawals"}
                    >
                        <FormattedMessage id="dashboard.transactions.chip.withdrawals" />
                    </Chip>
                </Box>
                <Box minWidth="auto">
                    <Chip
                        dark
                        onClick={handleTransfersChipClick}
                        active={typeFilter === "transfers"}
                    >
                        <FormattedMessage id="dashboard.transactions.chip.transfers" />
                    </Chip>
                </Box>
            </Flex>
            <ListFlex
                flexGrow="1"
                flexDirection="column"
                alignItems="center"
                width="100%"
                ref={scrollParentRef}
            >
                {!loading && (!transactions || transactions.length === 0) && (
                    <Box
                        width="100%"
                        height="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <FormattedMessage id="dashboard.transactions.empty" />
                    </Box>
                )}
                {!loading && transactions && transactions.length > 0 ? (
                    filteredTransactions && filteredTransactions.length > 0 ? (
                        <StyledInfiniteScroll
                            element="span"
                            pageStart={0}
                            loadMore={onLoadTransactions}
                            hasMore={hasMoreTransactions}
                            useWindow={false}
                            getScrollParent={handleGetScrollParent}
                        >
                            {filteredTransactions
                                .sort((a, b) => b.timestamp - a.timestamp)
                                .map((transaction) => (
                                    <Box
                                        key={transaction.id}
                                        height={68}
                                        width="100%"
                                        alignItems="center"
                                        display="flex"
                                    >
                                        <Transaction
                                            transaction={transaction}
                                            balances={balances}
                                            onClick={onChange}
                                            selectedFiat={selectedFiat}
                                        />
                                    </Box>
                                ))}
                        </StyledInfiniteScroll>
                    ) : (
                        <Box
                            width="100%"
                            height="100%"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <FormattedMessage id="dashboard.transactions.empty.search" />
                        </Box>
                    )
                ) : null}
                <LoadingOverlay light open={loading} />
            </ListFlex>
        </RootFlex>
    );
};

Transactions.propTypes = {
    balances: PropTypes.array.isRequired,
    transactions: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    typeFilter: PropTypes.oneOf(["all", "deposits", "withdrawals", "transfers"])
        .isRequired,
    onTypeFilterChange: PropTypes.func.isRequired,
    onLoadTransactions: PropTypes.func.isRequired,
    transactionsAmount: PropTypes.number.isRequired,
};
