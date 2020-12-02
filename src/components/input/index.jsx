import { Flex, Box } from "reflexbox";
import React from "react";
import PropTypes from "prop-types";
import {
    StyledInput,
    Label,
    Message,
    StyledNumericInput,
    MaxSelectorContainer,
    RelativeBox,
} from "./styled";
import { Button } from "../button";

export const Input = ({
    label,
    message,
    innerRef,
    numeric,
    maxSelector = false,
    onMaxClick,
    adornment,
    ...rest
}) => (
    <Flex flexDirection="column">
        {label && (
            <Box pl="8px" mb="8px">
                <Label>{label}</Label>
            </Box>
        )}
        <RelativeBox>
            {numeric ? (
                <>
                    <StyledNumericInput {...rest} ref={innerRef} />
                    {maxSelector && (
                        <MaxSelectorContainer>
                            <Button small onClick={onMaxClick}>
                                Max
                            </Button>
                        </MaxSelectorContainer>
                    )}
                </>
            ) : (
                <StyledInput {...rest} ref={innerRef} />
            )}
        </RelativeBox>
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
