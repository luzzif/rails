import React, { useCallback, useState, useEffect } from "react";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { login, getAuthStatus } from "../../actions/loopring";
import darkLogoBig from "../../images/logo-dark-big.svg";
import lightLogoBig from "../../images/logo-light-big.svg";
import {
    LoginIllustration,
    WelcomeTextBox,
    FullWidthButton,
    InvalidChainText,
} from "./styled";
import { BottomUpContainer } from "../../components/bottom-up-container";
import { initializeWeb3 } from "../../actions/web3";
import { RegistrationFlow } from "./registration-flow";
import { selectedTheme } from "../app";
import { getShortenedEthereumAddress } from "../../utils/conversion";
import {
    disableTestMode,
    enableTestMode,
} from "loopring-lightcone/lib/request";

const VALID_CHAIN_IDS = [1, 5];

const Auth = () => {
    const dispatch = useDispatch();
    const {
        web3Instance,
        chainId,
        selectedAccount,
        needsRegistration,
    } = useSelector((state) => ({
        web3Instance: state.web3.instance,
        chainId: state.web3.chainId,
        selectedAccount: state.web3.selectedAccount,
        needsRegistration: state.loopring.authStatus.needsRegistration,
    }));

    const [invalidChainId, setInvalidChainId] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!web3Instance) {
            dispatch(initializeWeb3());
        }
    }, [dispatch, web3Instance]);

    useEffect(() => {
        if (chainId) {
            setInvalidChainId(VALID_CHAIN_IDS.indexOf(chainId) < 0);
            if (chainId === 1) {
                console.log("enabling production mode...");
                disableTestMode();
                return;
            }
            console.log("enabling test mode...");
            enableTestMode();
        }
    }, [chainId]);

    useEffect(() => {
        if (selectedAccount) {
            dispatch(getAuthStatus(selectedAccount));
        }
    }, [dispatch, selectedAccount, chainId]);

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
        dispatch(login(web3Instance, selectedAccount));
    }, [dispatch, selectedAccount, web3Instance]);

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
                p="24px"
            >
                <Box mb="20px" width="280px" height="60px">
                    <LoginIllustration
                        src={
                            selectedTheme.type === "light"
                                ? darkLogoBig
                                : lightLogoBig
                        }
                    />
                </Box>
                <WelcomeTextBox mb="8px">
                    <FormattedMessage id="auth.welcome" />
                </WelcomeTextBox>
                <Box mb="32px" textAlign="center">
                    {invalidChainId ? (
                        <InvalidChainText>
                            <FormattedMessage id={"auth.chain.invalid"} />
                        </InvalidChainText>
                    ) : (
                        <FormattedMessage
                            id={
                                needsRegistration !== null && selectedAccount
                                    ? "auth.signin"
                                    : "auth.connect"
                            }
                        />
                    )}
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
                                invalidChainId ||
                                (needsRegistration !== null && selectedAccount)
                            }
                        >
                            {needsRegistration !== null && selectedAccount ? (
                                getShortenedEthereumAddress(selectedAccount)
                            ) : (
                                <FormattedMessage id="auth.connect.button" />
                            )}
                        </FullWidthButton>
                    </Box>
                    {(needsRegistration === null || invalidChainId) && (
                        <Box>
                            <FullWidthButton disabled>
                                <FormattedMessage id="auth.signin.button" />
                            </FullWidthButton>
                        </Box>
                    )}
                    {!invalidChainId && needsRegistration === true && (
                        <Box>
                            <FullWidthButton
                                disabled={invalidChainId}
                                onClick={handleRegisterClick}
                            >
                                <FormattedMessage id="auth.register.button" />
                            </FullWidthButton>
                        </Box>
                    )}
                    {!invalidChainId && needsRegistration === false && (
                        <Box>
                            <FullWidthButton
                                disabled={invalidChainId}
                                onClick={handleLoginClick}
                            >
                                <FormattedMessage id="auth.login.button" />
                            </FullWidthButton>
                        </Box>
                    )}
                </Flex>
            </Flex>
            <BottomUpContainer open={open && loggingIn} onClose={handleClose}>
                <Flex width="100%" flexDirection="column" alignItems="center">
                    <Box>
                        <FormattedMessage id="auth.login.proceed.message" />
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
