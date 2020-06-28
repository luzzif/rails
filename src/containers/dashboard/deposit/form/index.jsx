import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Flex, Box } from "reflexbox";
import { Button } from "../../../../components/button";
import { FormattedMessage } from "react-intl";
import { Input } from "../../../../components/input";
import BigNumber from "bignumber.js";
import { weiToEther } from "../../../../utils/conversion";
import { getDepositBalance } from "../../../../actions/loopring";

export const Form = ({ onConfirm, asset }) => {
    const dispatch = useDispatch();
    const {
        loopringAccount,
        loopringWallet,
        supportedTokens,
        depositBalance,
    } = useSelector((state) => ({
        loopringAccount: state.loopring.account,
        loopringWallet: state.loopring.wallet,
        supportedTokens: state.loopring.supportedTokens.data,
        depositBalance: state.loopring.depositBalance,
    }));

    const [parsedUserBalance, setParsedUserBalance] = useState(
        new BigNumber("0")
    );
    const [amount, setAmount] = useState(0);
    const [stringAmount, setStringAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

    // fetch updated asset's on-chain balance
    useEffect(() => {
        dispatch(
            getDepositBalance(loopringWallet, asset.symbol, supportedTokens)
        );
    }, [
        asset.symbol,
        dispatch,
        loopringAccount,
        loopringWallet,
        supportedTokens,
    ]);

    useEffect(() => {
        if (depositBalance) {
            setParsedUserBalance(weiToEther(depositBalance.decimalPlaces(4)));
        }
    }, [asset, depositBalance]);

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
                        <FormattedMessage id="deposit.form.placeholder.amount" />
                    }
                    placeholder="12.5"
                    value={stringAmount}
                    onChange={handleAmountChange}
                    message={
                        <FormattedMessage
                            id="deposit.form.amount.maximum"
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
