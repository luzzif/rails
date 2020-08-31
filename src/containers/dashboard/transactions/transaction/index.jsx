import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { OneLineText, AmountText, HoverableContainer } from "./styled";
import { TransactionIcon } from "./icon";
import { FormattedMessage } from "react-intl";
import { DateTime } from "luxon";
import { formatBigNumber } from "../../../../utils/conversion";

export const Transaction = ({ asset, transaction, onClick, selectedFiat }) => {
    const {
        etherAmount,
        deposit,
        memo,
        sent,
        withdrawal,
        timestamp,
        progress,
    } = transaction;
    const [referenceColor, setReferenceColor] = useState("");

    useEffect(() => {
        let referenceColor = "";
        if (deposit) {
            referenceColor = "#2E7D32";
        } else if (withdrawal) {
            referenceColor = "#C62828";
        } else if (sent) {
            referenceColor = "#D50000";
        } else {
            referenceColor = "#00C853";
        }
        setReferenceColor(referenceColor);
    }, [deposit, progress, sent, withdrawal]);

    const getText = () => {
        if (deposit) {
            return <FormattedMessage id="dashboard.transactions.deposit" />;
        }
        if (withdrawal) {
            return <FormattedMessage id="dashboard.transactions.withdrawal" />;
        }
        return memo;
    };

    const handleLocalClick = useCallback(() => {
        onClick(transaction);
    }, [onClick, transaction]);

    return (
        <HoverableContainer
            alignItems="center"
            pl={["16px", "20px"]}
            pr="24px"
            width="100%"
            height="100%"
            onClick={handleLocalClick}
        >
            <Box pr="16px" minWidth="auto">
                <TransactionIcon
                    deposit={deposit}
                    withdraw={withdrawal}
                    sent={sent}
                    color={referenceColor}
                />
            </Box>
            <Flex
                flexDirection="column"
                justifyContent="center"
                flexGrow="2"
                pr="16px"
            >
                <Box mb="4px">
                    <OneLineText>
                        {getText()} {progress && progress !== "100%" && "*"}
                    </OneLineText>
                </Box>
                <Box>
                    <OneLineText fontSize={12}>
                        {DateTime.fromMillis(timestamp).toLocaleString(
                            DateTime.DATETIME_SHORT
                        )}
                    </OneLineText>
                </Box>
            </Flex>
            <Flex
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="center"
                minWidth="auto"
            >
                <Box color={referenceColor} mb="4px">
                    {(!withdrawal && (deposit || !sent) ? "+" : "-") +
                        formatBigNumber(etherAmount)}
                </Box>
                <Box fontSize={12}>
                    <AmountText color={referenceColor}>
                        {(!withdrawal && (deposit || !sent) ? "+" : "-") +
                            formatBigNumber(
                                etherAmount.multipliedBy(asset.fiatValue)
                            )}{" "}
                        {selectedFiat.symbol}
                    </AmountText>
                </Box>
            </Flex>
        </HoverableContainer>
    );
};

Transaction.propTypes = {
    asset: PropTypes.object.isRequired,
    transaction: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
