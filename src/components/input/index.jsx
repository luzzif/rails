import { Flex, Box } from "reflexbox";
import React from "react";
import PropTypes from "prop-types";
import { StyledInput, Label, Message } from "./styled";

export const Input = ({ label, message, innerRef, ...rest }) => (
    <Flex flexDirection="column">
        {label && (
            <Box pl="16px" mb="8px">
                <Label>{label}</Label>
            </Box>
        )}
        <Box>
            <StyledInput {...rest} ref={innerRef} />
        </Box>
        {message && (
            <Box pl="16px" mt="8px">
                <Message>{message}</Message>
            </Box>
        )}
    </Flex>
);

Input.propTypes = {
    label: PropTypes.node,
    message: PropTypes.node,
};
