import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { Button } from "../../../../components/button";
import { FormattedMessage } from "react-intl";
import { Input } from "../../../../components/input";
import BigNumber from "bignumber.js";
import { weiToEther } from "../../../../utils/conversion";
import { OperationFee } from "../../../../components/operation-fee";

export const Form = ({
    onConfirm,
    supportedTokens,
    asset,
    open,
    loopringExchange,
}) => {
    const [parsedUserBalance, setParsedUserBalance] = useState(
        new BigNumber("0")
    );
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState(false);
    const [feeAmount, setFeeAmount] = useState(new BigNumber(0));
    const [aboveBalanceError, setAboveBalanceError] = useState(false);
    const [buttonLabelSuffix, setButtonLabelSuffix] = useState("confirm");

    useEffect(() => {
        setParsedUserBalance(weiToEther(asset.balance, asset.decimals));
    }, [asset, supportedTokens]);

    useEffect(() => {
        if (!open) {
            // reset state on close
            setAmount("");
            setAmountError(false);
        }
    }, [asset, open]);

    useEffect(() => {
        if (loopringExchange && loopringExchange.onchainFees) {
            const wrappedFee = loopringExchange.onchainFees.find(
                (fee) => fee.type === "withdraw"
            );
            if (wrappedFee && wrappedFee.fee) {
                setFeeAmount(weiToEther(new BigNumber(wrappedFee.fee), 18));
            }
        }
    }, [loopringExchange]);

    useEffect(() => {
        if (aboveBalanceError) {
            setButtonLabelSuffix("error.balance.maximum");
        } else {
            setButtonLabelSuffix("confirm");
        }
    }, [aboveBalanceError]);

    const handleAmountChange = useCallback(
        (wrappedAmount) => {
            const { value } = wrappedAmount;
            setAboveBalanceError(parsedUserBalance.isLessThan(value));
            setAmount(wrappedAmount.value);
        },
        [parsedUserBalance]
    );

    const handleConfirm = useCallback(() => {
        onConfirm(amount);
    }, [amount, onConfirm]);

    return (
        <Flex
            width="100%"
            height="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Box mb="16px" width="100%">
                <Input
                    label={
                        <FormattedMessage id="withdrawal.form.placeholder.amount" />
                    }
                    numeric
                    placeholder="1.6"
                    value={amount}
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={asset ? asset.precision : undefined}
                    onValueChange={handleAmountChange}
                    message={
                        <FormattedMessage
                            id="withdrawal.form.amount.maximum"
                            values={{
                                amount: parsedUserBalance
                                    .decimalPlaces(4)
                                    .toString(),
                            }}
                        />
                    }
                    error={amountError}
                />
            </Box>
            {feeAmount && (
                <Box mb="24px" textAlign="center">
                    <OperationFee
                        amount={feeAmount}
                        tokenSymbol="ETH"
                        variant="withdrawal"
                    />
                </Box>
            )}
            <Box>
                <Button
                    disabled={
                        !amount ||
                        aboveBalanceError ||
                        parseFloat(amount) === 0 ||
                        isNaN(parseFloat(amount)) ||
                        amountError
                    }
                    onClick={handleConfirm}
                >
                    <FormattedMessage
                        id={`withdrawal.form.${buttonLabelSuffix}`}
                    />
                </Button>
            </Box>
        </Flex>
    );
};

Form.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    supportedTokens: PropTypes.array.isRequired,
    loopringExchange: PropTypes.object,
};
