import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { Button } from "../../../../components/button";
import { FormattedMessage } from "react-intl";
import { Input } from "../../../../components/input";
import BigNumber from "bignumber.js";
import { weiToEther } from "../../../../utils/conversion";

export const Form = ({ onConfirm, asset }) => {
    const [parsedUserBalance, setParsedUserBalance] = useState(
        new BigNumber("0")
    );
    const [amount, setAmount] = useState(0);
    const [stringAmount, setStringAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        setParsedUserBalance(weiToEther(asset.balance.decimalPlaces(4)));
    }, [asset]);

    const handleAmountChange = useCallback(
        (event) => {
            const newAmount = event.target.value;
            if (newAmount === "0") {
                setAmount(0);
                setStringAmount(newAmount);
                setAmountError(true);
                return;
            }
            let numericAmount = parseFloat(newAmount);
            if (
                !newAmount ||
                newAmount.indexOf(",") >= 0 ||
                newAmount.indexOf(" ") >= 0 ||
                newAmount.indexOf("-") >= 0 ||
                numericAmount < 0 ||
                isNaN(numericAmount)
            ) {
                setAmountError(true);
                setStringAmount("");
                setAmount(0);
                return;
            }
            if (newAmount.endsWith(".") || numericAmount === 0) {
                setAmountError(true);
            } else {
                setAmountError(false);
            }
            if (
                /\.{2,}|[a-zA-Z]/.test(newAmount) ||
                newAmount.split(".").length > 2
            ) {
                return;
            }
            setStringAmount(newAmount);
            let properNumericValue = new BigNumber(
                isNaN(numericAmount) ? "0" : numericAmount.toString()
            );
            if (parsedUserBalance.isLessThan(properNumericValue)) {
                properNumericValue = parsedUserBalance.decimalPlaces(4);
                setStringAmount(properNumericValue.toString());
            }
            setAmount(properNumericValue.toNumber());
        },
        [parsedUserBalance]
    );

    const handleConfirm = useCallback(() => {
        onConfirm(amount);
    }, [amount, onConfirm]);

    return (
        <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={4}
            pt={1}
            px={[3, 4]}
        >
            <Box mb={4} width="100%">
                <Input
                    label={
                        <FormattedMessage id="withdrawal.form.placeholder.amount" />
                    }
                    placeholder="1.6"
                    value={stringAmount}
                    onChange={handleAmountChange}
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
            <Box>
                <Button
                    disabled={!amount || amountError}
                    onClick={handleConfirm}
                >
                    <FormattedMessage id="deposit.form.confirm" />
                </Button>
            </Box>
        </Flex>
    );
};

Form.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
};
