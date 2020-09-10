import React, { useCallback, useState, useEffect, useRef } from "react";
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
    const receiverInputRef = useRef(null);
    const {
        web3Instance,
        addressFromEns,
        loadingAddressFromEns,
        supportedTokens,
    } = useSelector((state) => ({
        web3Instance: state.web3.instance,
        addressFromEns: state.ens.address,
        loadingAddressFromEns: !!state.ens.loadings,
        supportedTokens: state.loopring.supportedTokens.data,
    }));

    const [parsedUserBalance, setParsedUserBalance] = useState(
        new BigNumber("0")
    );
    const [amount, setAmount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [resolvedReceiver, setResolvedReceiver] = useState("");
    const [usingEns, setUsingEns] = useState(false);
    const [memo, setMemo] = useState("");
    const [receiverError, setReceiverError] = useState(false);
    const [debouncedEnsLookup] = useDebouncedCallback((web3Instance, name) => {
        dispatch(getAddressFromEnsName(web3Instance, name));
    }, 500);

    useEffect(() => {
        if (!loadingAddressFromEns && addressFromEns) {
            setResolvedReceiver(addressFromEns);
        }
    }, [loadingAddressFromEns, addressFromEns]);

    useEffect(() => {
        if(!receiverInputRef.current) {
            return;
        }
        if (loadingAddressFromEns) {
            receiverInputRef.current.blur();
        } else {
            receiverInputRef.current.focus();
        }
    }, [loadingAddressFromEns, receiverInputRef]);

    useEffect(() => {
        setParsedUserBalance(weiToEther(asset.balance, asset.decimals));
    }, [asset, supportedTokens]);

    useEffect(() => {
        if (usingEns) {
            setReceiverError(!!!addressFromEns);
        }
    }, [addressFromEns, asset, usingEns]);

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

    const handleReceiverChange = useCallback(
        (event) => {
            const newReceiver = event.target.value;
            if (
                newReceiver &&
                newReceiver !== "0" &&
                !newReceiver.startsWith("0x")
            ) {
                debouncedEnsLookup(web3Instance, newReceiver);
                setUsingEns(true);
            } else {
                setUsingEns(false);
                setReceiverError(!isAddress(newReceiver));
                setResolvedReceiver(newReceiver);
            }
            setReceiver(newReceiver);
        },
        [debouncedEnsLookup, web3Instance]
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
                    innerRef={receiverInputRef}
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
                    value={amount}
                    onChange={handleAmountChange}
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
