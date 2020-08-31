import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { BoldDiv } from "./styled";
import { Button } from "../../../components/button";
import { CHAIN_ID } from "../../../env";
import { getEtherscanLink } from "../../../lightcone/api/localStorgeAPI";
import { formatBigNumber } from "../../../utils/conversion";

export const TransactionSummary = ({
    sent,
    deposit,
    withdrawal,
    timestamp,
    etherAmount,
    symbol,
    txHash,
    etherFeeAmount,
    progress,
    senderInUI,
    recipientInUI,
}) => {
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
                : {moment(timestamp).format("L - LT")}
            </Box>
            {sent && recipientInUI && (
                <Box mb="8px">
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.receiver" />
                    </BoldDiv>
                    : {recipientInUI}
                </Box>
            )}
            {!sent && senderInUI && (
                <Box mb="8px">
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.sender" />
                    </BoldDiv>
                    : {senderInUI}
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
                            href={`${getEtherscanLink(CHAIN_ID)}/tx/${txHash}`}
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
    sent: PropTypes.bool,
    deposit: PropTypes.bool,
    withdrawal: PropTypes.bool,
    timestamp: PropTypes.number.isRequired,
    etherAmount: PropTypes.object.isRequired,
    symbol: PropTypes.string.isRequired,
    txHash: PropTypes.string,
    etherFeeAmount: PropTypes.object.isRequired,
    progress: PropTypes.string.isRequired,
};
