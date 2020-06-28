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
import { OverlayBox } from "./styled";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
import { AllowanceConfirmation } from "./allowance/confirmation";
import { Form } from "./form";
import { BounceLoader } from "react-spinners";
import { selectedTheme } from "../../app";
import { Flex, Box } from "reflexbox";
import { DepositConfirmation } from "./form/confirmation";

export const DepositFlow = ({ open, asset }) => {
    const dispatch = useDispatch();
    const {
        loopringWallet,
        loopringExchange,
        supportedTokens,
        loadingAllowance,
        allowance,
        successfulGrantAllowanceHash,
        depositTransactionHash,
    } = useSelector((state) => ({
        loopringWallet: state.loopring.wallet,
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
                getTokenAllowance(loopringWallet, asset.symbol, supportedTokens)
            );
        }
    }, [open, dispatch, isEther, loopringWallet, asset, supportedTokens]);

    useEffect(() => {
        if (allowance) {
            setNeedsAllowance(!isEther && allowance.isZero());
        }
    }, [allowance, isEther]);

    useEffect(() => {
        if (needsAllowance && successfulGrantAllowanceHash) {
            setIndex(1);
        }
    }, [needsAllowance, successfulGrantAllowanceHash]);

    // resets the state
    useEffect(() => {
        if (!open) {
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
                    loopringWallet,
                    loopringExchange,
                    supportedTokens,
                    asset.symbol,
                    amount
                )
            );
        },
        [
            asset.symbol,
            dispatch,
            loopringExchange,
            loopringWallet,
            supportedTokens,
        ]
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
                        <OverlayBox open={loadingAllowance} />
                    </SwipeableViews>
                ) : (
                    <SwipeableViews
                        index={index}
                        disabled
                        style={{ overflowY: "hidden", width: "100%" }}
                    >
                        <Form asset={asset} onConfirm={handleConfirm} />
                        <DepositConfirmation
                            asset={asset}
                            transactionHash={depositTransactionHash}
                        />
                    </SwipeableViews>
                )}
            </Box>
            <OverlayBox
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                open={loadingAllowance}
            >
                <BounceLoader size={60} color={selectedTheme.loader} loading />
            </OverlayBox>
        </Flex>
    );
};

DepositFlow.propTypes = {
    open: PropTypes.bool.isRequired,
    asset: PropTypes.object.isRequired,
};
