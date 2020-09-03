import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
    getTokenAllowance,
    deleteGrantAllowanceTransactionHash,
    postDeposit,
    deleteDepositTransactionHash,
} from "../../../actions/loopring";
import { Allowance } from "./allowance";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
import { AllowanceConfirmation } from "./allowance/confirmation";
import { Form } from "./form";
import { Flex, Box } from "reflexbox";
import { DepositConfirmation } from "./form/confirmation";
import { LoadingOverlay } from "../../../components/loading-overlay";

export const DepositFlow = ({ open, asset }) => {
    const dispatch = useDispatch();
    const {
        web3Instance,
        ethereumAccount,
        loopringExchange,
        supportedTokens,
        loadingAllowance,
        allowance,
        successfulGrantAllowanceHash,
        depositTransactionHash,
    } = useSelector((state) => ({
        web3Instance: state.web3.instance,
        ethereumAccount: state.web3.selectedAccount,
        loopringExchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens.data,
        loadingAllowance: !!state.loopring.allowances.loadings,
        allowance: state.loopring.allowances[asset.symbol],
        successfulGrantAllowanceHash:
            state.loopring.successfulGrantAllowanceHash,
        depositTransactionHash: state.loopring.depositHash,
    }));

    const [isEther, setIsEther] = useState(false);
    const [index, setIndex] = useState(0);
    const [needsAllowance, setNeedsAllowance] = useState(false);

    useEffect(() => {
        setIsEther(asset.symbol === "ETH");
    }, [asset]);

    useEffect(() => {
        if (open && !isEther) {
            dispatch(
                getTokenAllowance(
                    ethereumAccount,
                    asset.symbol,
                    supportedTokens
                )
            );
        }
    }, [open, dispatch, isEther, ethereumAccount, asset, supportedTokens]);

    useEffect(() => {
        setNeedsAllowance(!isEther && allowance && allowance.isZero());
    }, [allowance, isEther]);

    useEffect(() => {
        if (needsAllowance && successfulGrantAllowanceHash) {
            setIndex(1);
        }
    }, [needsAllowance, successfulGrantAllowanceHash]);

    // resets the state
    useEffect(() => {
        if (!open) {
            setIndex(0);
            dispatch(deleteGrantAllowanceTransactionHash());
            dispatch(deleteDepositTransactionHash());
        }
    }, [dispatch, open]);

    useEffect(() => {
        if (depositTransactionHash) {
            setIndex(1);
        }
    }, [depositTransactionHash]);

    const handleConfirm = useCallback(
        (amount) => {
            dispatch(
                postDeposit(
                    web3Instance,
                    ethereumAccount,
                    loopringExchange,
                    asset,
                    amount
                )
            );
        },
        [asset, dispatch, ethereumAccount, loopringExchange, web3Instance]
    );

    return (
        <Flex width="100%" justifyContent="center" alignItems="center">
            <Box width="100%">
                {needsAllowance ? (
                    <SwipeableViews
                        index={index}
                        disabled
                        style={{ overflowY: "hidden", width: "100%" }}
                    >
                        {needsAllowance && <Allowance asset={asset} />}
                        {needsAllowance && (
                            <AllowanceConfirmation
                                asset={asset}
                                transactionHash={successfulGrantAllowanceHash}
                            />
                        )}
                    </SwipeableViews>
                ) : (
                    <SwipeableViews
                        index={index}
                        disabled
                        style={{ overflowY: "hidden", width: "100%" }}
                    >
                        <Form
                            asset={asset}
                            open={open}
                            onConfirm={handleConfirm}
                        />
                        <DepositConfirmation
                            asset={asset}
                            transactionHash={depositTransactionHash}
                        />
                    </SwipeableViews>
                )}
            </Box>
            <LoadingOverlay open={loadingAllowance} />
        </Flex>
    );
};

DepositFlow.propTypes = {
    open: PropTypes.bool.isRequired,
    asset: PropTypes.object.isRequired,
};
