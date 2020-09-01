import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Flex, Box } from "reflexbox";
import { Button } from "../../../../components/button";
import { FormattedMessage } from "react-intl";
import { isAddress } from "web3-utils";
import { Input } from "../../../../components/input";
import BigNumber from "bignumber.js";
import { getAddressFromEnsName } from "../../../../actions/ens";
import { useDebouncedCallback } from "use-debounce";
import { weiToEther } from "../../../../utils/conversion";
import { LoadingOverlay } from "../../../../components/loading-overlay";

export const Send = ({ onConfirm, asset }) => {
    const dispatch = useDispatch();
    const {
        loopringWallet,
        addressFromEns,
        loadingAddressFromEns,
        supportedTokens,
    } = useSelector((state) => ({
        loopringWallet: state.loopring.wallet,
        addressFromEns: state.ens.address,
        loadingAddressFromEns: !!state.ens.loadings,
        supportedTokens: state.loopring.supportedTokens.data,
    }));

    const [parsedUserBalance, setParsedUserBalance] = useState(
        new BigNumber("0")
    );
    const [amount, setAmount] = useState(0);
    const [stringAmount, setStringAmount] = useState("");
    const [amountError, setAmountError] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [resolvedReceiver, setResolvedReceiver] = useState("");
    const [usingEns, setUsingEns] = useState(false);
    const [memo, setMemo] = useState("");
    const [receiverError, setReceiverError] = useState(false);
    const [debouncedEnsLookup] = useDebouncedCallback((name) => {
        dispatch(getAddressFromEnsName(loopringWallet, name));
    }, 500);

    useEffect(() => {
        if (!loadingAddressFromEns && addressFromEns) {
            setResolvedReceiver(addressFromEns);
        }
    }, [loadingAddressFromEns, addressFromEns]);

    useEffect(() => {
        setParsedUserBalance(
            weiToEther(asset.balance, asset.symbol, supportedTokens)
        );
    }, [asset, supportedTokens]);

    useEffect(() => {
        if (usingEns) {
            setReceiverError(!!!addressFromEns);
        }
    }, [addressFromEns, asset, usingEns]);

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

    const handleReceiverChange = useCallback(
        (event) => {
            const newReceiver = event.target.value;
            if (
                newReceiver &&
                newReceiver !== "0" &&
                !newReceiver.startsWith("0x")
            ) {
                debouncedEnsLookup(newReceiver);
                setUsingEns(true);
            } else {
                setUsingEns(false);
                setReceiverError(!isAddress(newReceiver));
                setResolvedReceiver(newReceiver);
            }
            setReceiver(newReceiver);
        },
        [debouncedEnsLookup]
    );

    const handleMemoChange = useCallback((event) => {
        setMemo(event.target.value);
    }, []);

    const handleConfirm = useCallback(() => {
        onConfirm(resolvedReceiver, amount, memo);
    }, [amount, memo, onConfirm, resolvedReceiver]);

    return (
        <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Box mb="24px" width="100%">
                <Input
                    label={
                        <FormattedMessage id="send.form.placeholder.receiver" />
                    }
                    placeholder="foo.eth"
                    value={receiver}
                    onChange={handleReceiverChange}
                    error={receiverError}
                    message={
                        addressFromEns && (
                            <FormattedMessage
                                id="send.form.receiver.resolved"
                                values={{ address: addressFromEns }}
                            />
                        )
                    }
                />
            </Box>
            <Box mb="24px" width="100%">
                <Input
                    label={
                        <FormattedMessage id="send.form.placeholder.amount" />
                    }
                    placeholder="12.5"
                    value={stringAmount}
                    onChange={handleAmountChange}
                    error={amountError}
                />
            </Box>
            <Box mb="24px" width="100%">
                <Input
                    label={<FormattedMessage id="send.form.placeholder.memo" />}
                    placeholder="Foo Bar"
                    value={memo}
                    onChange={handleMemoChange}
                />
            </Box>
            <Box mb="8px">
                <Button
                    disabled={
                        !receiver ||
                        !amount ||
                        receiverError ||
                        amountError ||
                        loadingAddressFromEns
                    }
                    onClick={handleConfirm}
                >
                    <FormattedMessage id="send.form.confirm" />
                </Button>
            </Box>
            <LoadingOverlay open={loadingAddressFromEns} />
        </Flex>
    );
};

Send.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
};
