import React, { useCallback } from "react";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { Button } from "../../components/button";
import { useDispatch } from "react-redux";
import { initializeLoopring } from "../../actions/loopring";
import illustration from "../../images/login.png";
import { LoginIllustration } from "./styled";

export const Login = () => {
    const dispatch = useDispatch();

    const handleLogin = useCallback(() => {
        dispatch(initializeLoopring());
    }, [dispatch]);

    return (
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
                fontSize={20}
                width={["80%", "70%", "60%", "30%", "20%"]}
                textAlign="center"
            >
                <FormattedMessage id="login.summary" />
            </Box>
            <Box>
                <Button onClick={handleLogin}>
                    <FormattedMessage id="login.button" />
                </Button>
            </Box>
        </Flex>
    );
};
