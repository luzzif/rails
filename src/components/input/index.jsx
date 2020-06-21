import { Flex, Box } from "reflexbox";
import React from "react";
import PropTypes from "prop-types";
import { StyledInput, Label, Message } from "./styled";

export const Input = ({ label, message, ...rest }) => (
    <Flex flexDirection="column">
        {label && (
            <Box pl={2} mb={3}>
                <Label>{label}</Label>
            </Box>
        )}
        <Box>
            <StyledInput {...rest} />
        </Box>
        {message && (
            <Box mt={2}>
                <Message>{message}</Message>
            </Box>
        )}
    </Flex>
);

Input.propTypes = {
    label: PropTypes.node,
    message: PropTypes.node,
};
