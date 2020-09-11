import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { Transaction } from "./transaction";
import { FormattedMessage } from "react-intl";
import { ActionButton } from "../../../components/action-button";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { ListFlex, RootFlex } from "./styled";
import { Chip } from "../../../components/chip";
import { LoadingOverlay } from "../../../components/loading-overlay";
import { Pagination } from "../../../components/pagination";

export const Transactions = ({
    balances,
    transactions,
    loading,
    onChange,
    typeFilter,
    onTypeFilterChange,
    onRefresh,
    selectedFiat,
    onPageChange,
    page,
    transactionsAmount,
}) => {
    const handleRefresh = useCallback(() => {
        onRefresh();
    }, [onRefresh]);

    const handleDepositsChipClick = useCallback(() => {
        onTypeFilterChange("deposits");
    }, [onTypeFilterChange]);

    const handleWithdrawalsChipClick = useCallback(() => {
        onTypeFilterChange("withdrawals");
    }, [onTypeFilterChange]);

    const handleTransfersChipClick = useCallback(() => {
        onTypeFilterChange("transfers");
    }, [onTypeFilterChange]);

    return (
        <RootFlex
            width="100%"
            height="100%"
            flexDirection="column"
            alignItems="center"
            px="16px"
            pt="16px"
        >
            <Flex width="100%" mb="12px" alignItems="center">
                <Flex mr="16px" flexWrap="nowrap" width="100%" overflowX="auto">
                    <Box mr={12} minWidth="auto">
                        <Chip
                            dark
                            onClick={handleTransfersChipClick}
                            active={typeFilter === "transfers"}
                        >
                            <FormattedMessage id="dashboard.transactions.chip.transfers" />
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
                    <Box minWidth="auto">
                        <Chip
                            dark
                            onClick={handleWithdrawalsChipClick}
                            active={typeFilter === "withdrawals"}
                        >
                            <FormattedMessage id="dashboard.transactions.chip.withdrawals" />
                        </Chip>
                    </Box>
                </Flex>
                <Box minWidth="auto" mr="16px">
                    <ActionButton
                        faIcon={faRedo}
                        size={32}
                        faIconSize={16}
                        dark
                        onClick={handleRefresh}
                    />
                </Box>
            </Flex>
            <ListFlex
                flexGrow="1"
                flexDirection="column"
                alignItems="center"
                width="100%"
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
                {!loading &&
                    transactions &&
                    transactions.length > 0 &&
                    transactions.map((transaction) => (
                        <Box
                            key={transaction.id}
                            width="100%"
                            height="60px"
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
                <Flex width="100%" justifyContent="flex-end">
                    <Box>
                        <LoadingOverlay light open={loading} />
                    </Box>
                </Flex>
            </ListFlex>
            <Flex
                width="100%"
                my="16px"
                pr="16px"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Box>
                    <Pagination
                        page={page}
                        itemsPerPage={5}
                        size={transactionsAmount}
                        onPageChange={onPageChange}
                    />
                </Box>
            </Flex>
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
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    transactionsAmount: PropTypes.number.isRequired,
};
