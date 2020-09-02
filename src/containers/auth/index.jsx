import React, { useCallback, useState, useEffect } from "react";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { Button } from "../../components/button";
import { useDispatch, useSelector } from "react-redux";
import { login, getAuthStatus } from "../../actions/loopring";
import darkLogo from "../../images/logo-dark.svg";
import lightLogo from "../../images/logo-light.svg";
import { LoginIllustration, WelcomeTextBox, FullWidthButton } from "./styled";
import { BottomUpContainer } from "../../components/bottom-up-container";
import { initializeWeb3 } from "../../actions/web3";
import { RegistrationFlow } from "./registration-flow";
import { selectedTheme } from "../app";
import { getShortenedEthereumAddress } from "../../utils/conversion";

const Auth = () => {
    const dispatch = useDispatch();
    const { web3Instance, selectedAccount, needsRegistration } = useSelector(
        (state) => ({
            web3Instance: state.web3.instance,
            selectedAccount: state.web3.selectedAccount,
            needsRegistration: state.loopring.authStatus.needsRegistration,
        })
    );

    const [loggingIn, setLoggingIn] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (selectedAccount) {
            dispatch(getAuthStatus(selectedAccount));
        }
    }, [dispatch, selectedAccount]);

    const handleConnectClick = useCallback(() => {
        if (!web3Instance) {
            dispatch(initializeWeb3());
        }
    }, [dispatch, web3Instance]);

    const handleLoginClick = useCallback(() => {
        if (!web3Instance) {
            dispatch(initializeWeb3());
        }
        setRegistering(false);
        setLoggingIn(true);
    }, [dispatch, web3Instance]);

    const handleRegisterClick = useCallback(() => {
        if (!web3Instance) {
            dispatch(initializeWeb3());
        }
        setLoggingIn(false);
        setRegistering(true);
    }, [dispatch, web3Instance]);

    useEffect(() => {
        setOpen(web3Instance && (loggingIn || registering));
    }, [loggingIn, registering, web3Instance]);

    const handleLoginProceed = useCallback(() => {
        dispatch(login(web3Instance, selectedAccount));
    }, [dispatch, selectedAccount, web3Instance]);

    const handleClose = useCallback(() => {
        setLoggingIn(false);
        setRegistering(false);
    }, []);

    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                width="100%"
                height="100%"
            >
                <Box mb="20px" width="80px">
                    <LoginIllustration
                        src={
                            selectedTheme.type === "light"
                                ? darkLogo
                                : lightLogo
                        }
                    />
                </Box>
                <WelcomeTextBox mb="8px">
                    <FormattedMessage id="auth.welcome" />
                </WelcomeTextBox>
                <Box mb="32px" textAlign="center">
                    <FormattedMessage
                        id={
                            needsRegistration !== null && selectedAccount
                                ? "auth.signin"
                                : "auth.connect"
                        }
                    />
                </Box>
                <Flex
                    flexDirection="column"
                    width="280px"
                    justifyContent="stretch"
                >
                    <Box mb="16px" width="100%">
                        <FullWidthButton
                            onClick={handleConnectClick}
                            disabled={
                                needsRegistration !== null && selectedAccount
                            }
                        >
                            {needsRegistration !== null && selectedAccount ? (
                                getShortenedEthereumAddress(selectedAccount)
                            ) : (
                                <FormattedMessage id="auth.connect.button" />
                            )}
                        </FullWidthButton>
                    </Box>
                    {needsRegistration === null && (
                        <Box>
                            <FullWidthButton disabled>
                                <FormattedMessage id="auth.signin.button" />
                            </FullWidthButton>
                        </Box>
                    )}
                    {needsRegistration === true && (
                        <Box>
                            <FullWidthButton onClick={handleRegisterClick}>
                                <FormattedMessage id="auth.register.button" />
                            </FullWidthButton>
                        </Box>
                    )}
                    {needsRegistration === false && (
                        <Box>
                            <FullWidthButton onClick={handleLoginClick}>
                                <FormattedMessage id="auth.login.button" />
                            </FullWidthButton>
                        </Box>
                    )}
                </Flex>
            </Flex>
            <BottomUpContainer open={open && loggingIn} onClose={handleClose}>
                <Flex width="100%" flexDirection="column" alignItems="center">
                    <Box mb="24px">
                        <FormattedMessage id="auth.login.proceed.message" />
                    </Box>
                    <Box>
                        <Button onClick={handleLoginProceed}>
                            <FormattedMessage id="auth.login.proceed.button.title" />
                        </Button>
                    </Box>
                </Flex>
            </BottomUpContainer>
            <BottomUpContainer open={open && registering} onClose={handleClose}>
                <RegistrationFlow open={open && registering} />
            </BottomUpContainer>
        </>
    );
};

export default Auth;
