import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { DateTime } from "luxon";
import { BoldDiv } from "./styled";
import { Button } from "../../../components/button";
import { formatBigNumber } from "../../../utils/conversion";

export const TransactionSummary = ({ transaction }) => {
    if (!transaction) {
        return null;
    }
    const {
        sent,
        deposit,
        withdrawal,
        timestamp,
        etherAmount,
        symbol,
        txHash,
        etherFeeAmount,
        progress,
        senderAddress,
        receiverAddress,
    } = transaction;

    const getType = () => {
        let id;
        if (deposit) {
            id = "dashboard.transaction.summary.type.deposit";
        } else if (withdrawal) {
            id = "dashboard.transaction.summary.type.withdrawal";
        } else if (sent) {
            id = "dashboard.transaction.summary.type.sent";
        } else {
            id = "dashboard.transaction.summary.type.received";
        }
        return <FormattedMessage id={id} />;
    };

    return (
        <Flex width="100%" flexDirection="column">
            <Box mb="8px">
                <BoldDiv>
                    <FormattedMessage id="dashboard.transaction.summary.type" />
                </BoldDiv>
                : {getType()}
            </Box>
            <Box mb="8px">
                <BoldDiv>
                    <FormattedMessage id="dashboard.transaction.summary.date" />
                </BoldDiv>
                :{" "}
                {DateTime.fromMillis(timestamp).toLocaleString(
                    DateTime.DATETIME_SHORT
                )}
            </Box>
            {sent && receiverAddress && (
                <Box mb="8px">
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.receiver" />
                    </BoldDiv>
                    : {receiverAddress}
                </Box>
            )}
            {!sent && senderAddress && (
                <Box mb="8px">
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.sender" />
                    </BoldDiv>
                    : {senderAddress}
                </Box>
            )}
            <Box mb="8px">
                <BoldDiv>
                    <FormattedMessage id="dashboard.transaction.summary.amount" />
                </BoldDiv>
                : {formatBigNumber(etherAmount)} {symbol}
            </Box>
            <Box mb="8px">
                <BoldDiv>
                    <FormattedMessage id="dashboard.transaction.summary.amount.fee" />
                </BoldDiv>
                : {formatBigNumber(etherFeeAmount)}{" "}
                {deposit || withdrawal ? "ETH" : symbol}
            </Box>
            {progress && (
                <Box mb="8px">
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.progress" />
                    </BoldDiv>
                    : {progress}
                </Box>
            )}
            {txHash && (
                <Flex justifyContent="center">
                    <Box mt="24px">
                        <Button
                            link
                            external
                            href={`https://etherscan.io/tx/${txHash}`}
                        >
                            <FormattedMessage id="dashboard.transaction.summary.etherscan" />
                        </Button>
                    </Box>
                </Flex>
            )}
        </Flex>
    );
};

TransactionSummary.propTypes = {
    transaction: PropTypes.shape({
        sent: PropTypes.bool,
        deposit: PropTypes.bool,
        withdrawal: PropTypes.bool,
        timestamp: PropTypes.number.isRequired,
        etherAmount: PropTypes.object.isRequired,
        symbol: PropTypes.string.isRequired,
        txHash: PropTypes.string,
        etherFeeAmount: PropTypes.object.isRequired,
        progress: PropTypes.string.isRequired,
    }),
};
