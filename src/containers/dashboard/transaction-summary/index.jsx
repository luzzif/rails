import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import BigNumber from "bignumber.js";
import { weiToEther } from "../../../utils/conversion";
import { BoldDiv } from "./styled";
import { Button } from "../../../components/button";

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
}) => {
    const [etherAmount, setEtherAmount] = useState(new BigNumber("0"));
    const [etherFeeAmount, setEtherFeeAmount] = useState(new BigNumber("0"));

    useEffect(() => {
        setEtherAmount(weiToEther(amount));
    }, [amount]);

    useEffect(() => {
        setEtherFeeAmount(weiToEther(feeAmount));
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

    const getEtherscanLink = () => `https://etherscan.com/tx/${txHash}`;

    return (
        <>
            <Flex width="100%" flexDirection="column" pb={4} px={[3, 4]}>
                <Box fontSize={20} mb={3}>
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.title" />
                    </BoldDiv>
                </Box>
                <Box mb={2}>
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.type" />
                    </BoldDiv>
                    : {getType()}
                </Box>
                <Box mb={2}>
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.date" />
                    </BoldDiv>
                    : {moment(timestamp).format("L - LT")}
                </Box>
                <Box mb={2}>
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.amount" />
                    </BoldDiv>
                    : {etherAmount.decimalPlaces(4).toString()} {symbol}
                </Box>
                <Box mb={2}>
                    <BoldDiv>
                        <FormattedMessage id="dashboard.transaction.summary.amount.fee" />
                    </BoldDiv>
                    : {etherFeeAmount.decimalPlaces(4).toString()} {symbol}
                </Box>
                {progress && (
                    <Box mb={2}>
                        <BoldDiv>
                            <FormattedMessage id="dashboard.transaction.summary.progress" />
                        </BoldDiv>
                        : {progress}
                    </Box>
                )}
                {txHash && (
                    <Flex justifyContent="center">
                        <Box mt={4}>
                            <Button link external href={getEtherscanLink()}>
                                <FormattedMessage id="dashboard.transaction.summary.etherscan" />
                            </Button>
                        </Box>
                    </Flex>
                )}
            </Flex>
        </>
    );
};

TransactionSummary.propTypes = {
    sent: PropTypes.bool.isRequired,
    deposit: PropTypes.bool.isRequired,
    withdrawal: PropTypes.bool.isRequired,
    timestamp: PropTypes.number.isRequired,
    amount: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    txHash: PropTypes.string.isRequired,
    feeAmount: PropTypes.string.isRequired,
    progress: PropTypes.string.isRequired,
};
