import { Flex, Box } from "reflexbox";
import React from "react";
import PropTypes from "prop-types";
import { StyledInput, Label, Message, StyledNumericInput } from "./styled";

export const Input = ({ label, message, innerRef, numeric, ...rest }) => (
    <Flex flexDirection="column">
        {label && (
            <Box pl="8px" mb="8px">
                <Label>{label}</Label>
            </Box>
        )}
        <Box>
            {numeric ? (
                <StyledNumericInput {...rest} ref={innerRef} />
            ) : (
                <StyledInput {...rest} ref={innerRef} />
            )}
        </Box>
        {message && (
            <Box pl="8px" mt="8px">
                <Message>{message}</Message>
            </Box>
        )}
    </Flex>
);

Input.propTypes = {
    label: PropTypes.node,
    message: PropTypes.node,
};
