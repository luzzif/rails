import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { OneLineText, AmountText, HoverableContainer } from "./styled";
import { TransactionIcon } from "./icon";
import { FormattedMessage } from "react-intl";
import { weiToEther } from "../../../../utils/conversion";
import BigNumber from "bignumber.js";
import moment from "moment";

export const Transaction = ({ asset, transaction, onClick, selectedFiat }) => {
    const {
        amount,
        deposit,
        memo,
        sent,
        withdrawal,
        timestamp,
        progress,
    } = transaction;
    const [etherAmount, setEtherAmount] = useState(new BigNumber("0"));
    const [referenceColor, setReferenceColor] = useState("");

    useEffect(() => {
        setEtherAmount(weiToEther(amount));
    }, [amount]);

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
            pl={[2, 3]}
            pr={[3, 3]}
            width="100%"
            height="100%"
            onClick={handleLocalClick}
        >
            <Box pr={3} minWidth="auto">
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
                flexGrow={2}
                pr={3}
            >
                <Box mb={1}>
                    <OneLineText>
                        {getText()} {progress !== "100%" && "*"}
                    </OneLineText>
                </Box>
                <Box>
                    <OneLineText fontSize={12}>
                        {moment(timestamp).format("L - LT")}
                    </OneLineText>
                </Box>
            </Flex>
            <Flex
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="center"
                minWidth="auto"
            >
                <Box color={referenceColor} mb={1}>
                    {(!withdrawal && (deposit || !sent) ? "+" : "-") +
                        etherAmount.decimalPlaces(4).toString()}
                </Box>
                <Box fontSize={12}>
                    <AmountText color={referenceColor}>
                        {(deposit || !sent ? "+" : "-") +
                            etherAmount
                                .multipliedBy(asset.fiatValue)
                                .decimalPlaces(2)
                                .toString()}{" "}
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
