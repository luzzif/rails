import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteWithdrawalTransactionHash,
    postOnchainWithdrawal,
} from "../../../actions/loopring";
import SwipeableViews from "react-swipeable-views";
import { Form } from "./form";
import { Flex, Box } from "reflexbox";
import { Confirmation } from "./confirmation";

export const WithdrawalFlow = ({ open, asset }) => {
    const dispatch = useDispatch();
    const {
        loopringWallet,
        loopringExchange,
        supportedTokens,
        withdrawalTransactionHash,
    } = useSelector((state) => ({
        loopringWallet: state.loopring.wallet,
        loopringExchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens.data,
        withdrawalTransactionHash: state.loopring.withdrawalTransactionHash,
    }));

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (withdrawalTransactionHash) {
            setIndex(1);
        }
    }, [withdrawalTransactionHash]);

    // resets the state
    useEffect(() => {
        if (!open) {
            dispatch(deleteWithdrawalTransactionHash());
        }
    }, [dispatch, open]);

    const handleConfirm = useCallback(
        (amount) => {
            dispatch(
                postOnchainWithdrawal(
                    loopringWallet,
                    loopringExchange,
                    asset.symbol,
                    supportedTokens,
                    amount
                )
            );
        },
        [asset, dispatch, loopringExchange, loopringWallet, supportedTokens]
    );

    return (
        <Flex width="100%" justifyContent="center" alignItems="center">
            <Box width="100%">
                <SwipeableViews
                    index={index}
                    disabled
                    style={{ overflowY: "hidden", width: "100%" }}
                >
                    <Form asset={asset} onConfirm={handleConfirm} />
                    <Confirmation
                        asset={asset}
                        transactionHash={withdrawalTransactionHash}
                    />
                </SwipeableViews>
            </Box>
        </Flex>
    );
};

WithdrawalFlow.propTypes = {
    open: PropTypes.bool.isRequired,
    asset: PropTypes.object.isRequired,
};
