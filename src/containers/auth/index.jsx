import React, { useCallback, useState, useEffect } from "react";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { Button } from "../../components/button";
import { useDispatch, useSelector } from "react-redux";
import { initializeLoopring, registerAccount } from "../../actions/loopring";
import illustration from "../../images/login.png";
import { LoginIllustration } from "./styled";
import { BottomUpContainer } from "../../components/bottom-up-container";
import { initializeWeb3 } from "../../actions/web3";

export const Auth = () => {
    const dispatch = useDispatch();
    const { web3Instance } = useSelector((state) => ({
        web3Instance: state.web3.instance,
    }));

    const [loggingIn, setLoggingIn] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLoginClick = useCallback(() => {
        dispatch(initializeWeb3());
        setRegistering(false);
        setLoggingIn(true);
    }, [dispatch]);

    const handleRegisterClick = useCallback(() => {
        dispatch(initializeWeb3());
        setLoggingIn(false);
        setRegistering(true);
    }, [dispatch]);

    useEffect(() => {
        setOpen(web3Instance && (loggingIn || registering));
    }, [loggingIn, registering, web3Instance]);

    const handleLoginProceed = useCallback(() => {
        dispatch(initializeLoopring(web3Instance));
    }, [dispatch, web3Instance]);

    const handleRegisterProceed = useCallback(() => {
        dispatch(registerAccount(web3Instance));
    }, [dispatch, web3Instance]);

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
                <Box mb={4} width={["40%", "30%", "20%", "10%"]}>
                    <LoginIllustration src={illustration} />
                </Box>
                <Box
                    mb={4}
                    width={["80%", "70%", "60%", "30%", "20%"]}
                    textAlign="center"
                >
                    <FormattedMessage id="auth.summary" />
                </Box>
                <Flex>
                    <Box mr={4}>
                        <Button onClick={handleLoginClick}>
                            <FormattedMessage id="auth.login.button" />
                        </Button>
                    </Box>
                    <Box>
                        <Button secondary onClick={handleRegisterClick}>
                            <FormattedMessage id="auth.register.button" />
                        </Button>
                    </Box>
                </Flex>
            </Flex>
            <BottomUpContainer open={open} onClose={handleClose}>
                <Flex
                    width="100%"
                    flexDirection="column"
                    alignItems="center"
                    pb={4}
                    px={[3, 4]}
                >
                    {loggingIn && (
                        <>
                            <Box mb={2}>
                                <FormattedMessage id="auth.login.proceed.message" />
                            </Box>
                            <Box mt={4}>
                                <Button onClick={handleLoginProceed}>
                                    <FormattedMessage id="auth.login.proceed.button.title" />
                                </Button>
                            </Box>
                        </>
                    )}
                    {registering && (
                        <>
                            <Box mb={2}>
                                <FormattedMessage id="auth.register.proceed.message.1" />
                            </Box>
                            <Box>
                                <FormattedMessage id="auth.register.proceed.message.2" />
                            </Box>
                            <Box mt={4}>
                                <Button onClick={handleRegisterProceed}>
                                    <FormattedMessage id="auth.register.proceed.button.title" />
                                </Button>
                            </Box>
                        </>
                    )}
                </Flex>
            </BottomUpContainer>
        </>
    );
};
