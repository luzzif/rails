import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { Transaction } from "./transaction";
import { FormattedMessage, useIntl } from "react-intl";
import { Searchbar } from "../../../components/searchbar";
import { BounceLoader } from "react-spinners";
import { selectedTheme } from "../../app";
import { ActionButton } from "../../../components/action-button";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { OverlayBox, RootFlex } from "./styled";

export const Transactions = ({
    asset,
    transactions,
    loading,
    onChange,
    onRefresh,
}) => {
    const { formatMessage } = useIntl();

    const [query, setQuery] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState(
        transactions
    );

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

    return (
        <RootFlex
            width="100%"
            height="100%"
            flexDirection="column"
            alignItems="center"
            pt={3}
            px={2}
        >
            <Flex px={[2, 3]} mb={2} width="100%">
                <Box pr={3} flexGrow={1}>
                    <Searchbar
                        dark
                        placeholder={formatMessage({
                            id: "dashboard.transactions.search.placeholder",
                        })}
                        value={query}
                        onChange={handleSearchbarChange}
                    />
                </Box>
                <Box minWidth="auto">
                    <ActionButton
                        faIcon={faRedo}
                        size={48}
                        faIconSize={20}
                        dark
                        onClick={handleRefresh}
                    />
                </Box>
            </Flex>
            {(!transactions || transactions.length === 0) && (
                <Box>
                    <FormattedMessage id="dashboard.transactions.empty" />
                </Box>
            )}
            {transactions && transactions.length > 0 ? (
                filteredTransactions && filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                        <Box
                            key={transaction.id}
                            height={68}
                            width="100%"
                            alignItems="center"
                            display="flex"
                        >
                            <Transaction
                                transaction={transaction}
                                asset={asset}
                                onClick={onChange}
                            />
                        </Box>
                    ))
                ) : (
                    <Box textAlign="center" mt={2} px={3}>
                        <FormattedMessage id="dashboard.transactions.empty.search" />
                    </Box>
                )
            ) : null}
            <OverlayBox
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                open={loading}
            >
                <BounceLoader size={60} color={selectedTheme.loader} loading />
            </OverlayBox>
        </RootFlex>
    );
};

Transactions.propTypes = {
    asset: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};
