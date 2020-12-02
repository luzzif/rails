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
import { OperationFee } from "../../../../components/operation-fee";

export const Form = ({ onConfirm, asset, open }) => {
    const dispatch = useDispatch();
    const {
        ethereumAccount,
        loopringExchange,
        supportedTokens,
        depositBalance,
    } = useSelector((state) => ({
        ethereumAccount: state.web3.selectedAccount,
        loopringExchange: state.loopring.exchange,
        loopringAccount: state.loopring.account,
        supportedTokens: state.loopring.supportedTokens.data,
        depositBalance: state.loopring.depositBalance,
    }));

    const [parsedUserBalance, setParsedUserBalance] = useState(
        new BigNumber("0")
    );
    const [amount, setAmount] = useState("");
    const [feeAmount, setFeeAmount] = useState(new BigNumber(0));
    const [aboveBalanceError, setAboveBalanceError] = useState(false);
    const [buttonLabelSuffix, setButtonLabelSuffix] = useState("confirm");

    // fetch updated asset's on-chain balance
    useEffect(() => {
        if (ethereumAccount && asset && asset.symbol && supportedTokens) {
            dispatch(
                getDepositBalance(
                    ethereumAccount,
                    asset.symbol,
                    supportedTokens
                )
            );
        }
    }, [asset, dispatch, ethereumAccount, supportedTokens]);

    useEffect(() => {
        if (loopringExchange && loopringExchange.onchainFees) {
            const wrappedFee = loopringExchange.onchainFees.find(
                (fee) => fee.type === "deposit"
            );
            if (wrappedFee) {
                setFeeAmount(weiToEther(new BigNumber(wrappedFee.fee), 18));
            }
        }
    }, [loopringExchange]);

    useEffect(() => {
        if (depositBalance) {
            setParsedUserBalance(weiToEther(depositBalance, asset.decimals));
        }
    }, [asset, depositBalance, supportedTokens]);

    useEffect(() => {
        if (!open) {
            // reset the state on close
            setParsedUserBalance(new BigNumber("0"));
            setAmount("");
        }
    }, [open]);

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

    const handleMaxClick = useCallback(() => {
        setAmount(parsedUserBalance.toString());
    }, [parsedUserBalance]);

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
                        <FormattedMessage id="deposit.form.placeholder.amount" />
                    }
                    numeric
                    placeholder="12.5"
                    value={amount}
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={asset ? asset.precision : undefined}
                    onValueChange={handleAmountChange}
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
                    maxSelector
                    onMaxClick={handleMaxClick}
                />
            </Box>
            {feeAmount && (
                <Box mb="24px" textAlign="center">
                    <OperationFee
                        amount={feeAmount}
                        tokenSymbol="ETH"
                        variant="deposit"
                    />
                </Box>
            )}
            <Box>
                <Button
                    disabled={
                        !amount ||
                        aboveBalanceError ||
                        parseFloat(amount) === 0 ||
                        isNaN(parseFloat(amount))
                    }
                    onClick={handleConfirm}
                >
                    <FormattedMessage
                        id={`deposit.form.${buttonLabelSuffix}`}
                    />
                </Button>
            </Box>
        </Flex>
    );
};

Form.propTypes = {
    open: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
};
