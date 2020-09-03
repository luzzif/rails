import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { Button } from "../../../components/button";
import { useSelector, useDispatch } from "react-redux";
import {
    registerAccount,
    deleteRegistrationTransactionHash,
} from "../../../actions/loopring";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";

export const RegistrationFlow = ({ open }) => {
    const dispatch = useDispatch();
    const { web3Instance, selectedAccount, transactionHash } = useSelector(
        (state) => ({
            web3Instance: state.web3.instance,
            selectedAccount: state.web3.selectedAccount,
            transactionHash: state.loopring.successfulRegistrationHash,
        })
    );

    const [index, setIndex] = useState(0);

    const handleRegisterProceed = useCallback(() => {
        dispatch(registerAccount(web3Instance, selectedAccount));
    }, [dispatch, web3Instance, selectedAccount]);

    useEffect(() => {
        if (transactionHash) {
            setIndex(1);
        }
    }, [transactionHash]);

    useEffect(() => {
        if (!open) {
            setIndex(0);
            dispatch(deleteRegistrationTransactionHash());
        }
    }, [dispatch, open, transactionHash]);

    return (
        <SwipeableViews index={index} disabled style={{ width: "100%" }}>
            <Flex
                width="100%"
                height="100%"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Box mb="16px">
                    <FormattedMessage id="auth.register.proceed.message.1" />
                </Box>
                <Box mb="24px">
                    <FormattedMessage id="auth.register.proceed.message.2" />
                </Box>
                <Box>
                    <Button onClick={handleRegisterProceed}>
                        <FormattedMessage id="auth.register.proceed.button.title" />
                    </Button>
                </Box>
            </Flex>
            <Flex
                width="100%"
                height="100%"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Box mb="24px">
                    <FormattedMessage id="auth.register.confirmation.message" />
                </Box>
                <Box>
                    <Button
                        link
                        external
                        href={`https://etherscan.io/tx/${transactionHash}`}
                    >
                        <FormattedMessage id="auth.register.confirmation.button.title" />
                    </Button>
                </Box>
            </Flex>
        </SwipeableViews>
    );
};

RegistrationFlow.propTypes = {
    open: PropTypes.bool,
};
