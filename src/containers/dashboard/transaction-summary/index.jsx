import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import BigNumber from "bignumber.js";
import { weiToEther } from "../../../utils/conversion";
import { BoldDiv } from "./styled";
import { Button } from "../../../components/button";
import { CHAIN_ID } from "../../../env";
import { getEtherscanLink } from "../../../lightcone/api/localStorgeAPI";

export const TransactionSummary = ({
    sent,
    deposit,
    withdrawal,
    timestamp,
    amount,
    symbol,
    txHash,
    feeAmount,
    progress,
    senderInUI,
    recipientInUI,
}) => {
    const [etherAmount, setEtherAmount] = useState(new BigNumber("0"));
    const [etherFeeAmount, setEtherFeeAmount] = useState(new BigNumber("0"));

    useEffect(() => {
        if (amount) {
            setEtherAmount(weiToEther(amount));
        }
    }, [amount]);

    useEffect(() => {
        if (feeAmount) {
            setEtherFeeAmount(weiToEther(feeAmount));
        }
    }, [feeAmount]);

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
                : {etherAmount.decimalPlaces(4).toString()} {symbol}
            </Box>
            <Box mb="8px">
                <BoldDiv>
                    <FormattedMessage id="dashboard.transaction.summary.amount.fee" />
                </BoldDiv>
                : {etherFeeAmount.decimalPlaces(4).toString()} {symbol}
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
    amount: PropTypes.object.isRequired,
    symbol: PropTypes.string.isRequired,
    txHash: PropTypes.string,
    feeAmount: PropTypes.object.isRequired,
    progress: PropTypes.string.isRequired,
};
