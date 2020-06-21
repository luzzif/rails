import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { Transaction } from "./transaction";
import { FormattedMessage, useIntl } from "react-intl";
import { Searchbar } from "../../../components/searchbar";
import { BounceLoader } from "react-spinners";
import { selectedTheme } from "../../app";

export const Transactions = ({ asset, transactions, loading, onChange }) => {
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

    if (loading) {
        return (
            <Flex
                width="100%"
                height="100%"
                alignItems="center"
                justifyContent="center"
            >
                <BounceLoader size={60} color={selectedTheme.loader} loading />
            </Flex>
        );
    }
    if (
        !query &&
        (!filteredTransactions || filteredTransactions.length === 0)
    ) {
        return (
            <Flex width="100%" mt={4} justifyContent="center">
                <Box>
                    <FormattedMessage id="dashboard.transactions.empty" />
                </Box>
            </Flex>
        );
    }
    return (
        <Flex
            width="100%"
            height="100%"
            flexDirection="column"
            alignItems="center"
            pt={3}
            px={2}
        >
            <Flex width="100%" px={[2, 3]} mb={2}>
                <Box width="100%">
                    <Searchbar
                        dark
                        placeholder={formatMessage({
                            id: "dashboard.transactions.search.placeholder",
                        })}
                        value={query}
                        onChange={handleSearchbarChange}
                    />
                </Box>
            </Flex>
            {filteredTransactions && filteredTransactions.length > 0 ? (
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
            )}
        </Flex>
    );
};

Transactions.propTypes = {
    asset: PropTypes.object.isRequired,
    transactions: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};
