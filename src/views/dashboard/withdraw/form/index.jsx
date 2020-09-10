import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { Button } from "../../../../components/button";
import { FormattedMessage } from "react-intl";
import { Input } from "../../../../components/input";
import BigNumber from "bignumber.js";
import { weiToEther } from "../../../../utils/conversion";

export const Form = ({ onConfirm, supportedTokens, asset, open }) => {
    const [parsedUserBalance, setParsedUserBalance] = useState(
        new BigNumber("0")
    );
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

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

    const handleAmountChange = useCallback(
        (event) => {
            let newAmount = event.target.value.replace(",", "");
            if (/^(\d+)?(\.\d*)?$/.test(newAmount)) {
                if (parsedUserBalance.isLessThan(newAmount)) {
                    newAmount = parsedUserBalance.decimalPlaces(4).toFixed();
                }
                setAmount(newAmount);
            } else {
                setAmount("");
            }
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
            <Box mb="24px" width="100%">
                <Input
                    label={
                        <FormattedMessage id="withdrawal.form.placeholder.amount" />
                    }
                    placeholder="1.6"
                    value={amount}
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
                    disabled={
                        !amount ||
                        parseFloat(amount) === 0 ||
                        isNaN(parseFloat(amount)) ||
                        amountError
                    }
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
    open: PropTypes.bool.isRequired,
    supportedTokens: PropTypes.array.isRequired,
};
