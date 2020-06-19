import { Flex, Box } from "reflexbox";
import React from "react";
import { StyledInput, Label } from "./styled";

export const Input = ({ label, ...rest }) => (
    <Flex flexDirection="column">
        {label && (
            <Box pl={2} mb={3}>
                <Label>{label}</Label>
            </Box>
        )}
        <Box>
            <StyledInput {...rest} />
        </Box>
    </Flex>
);
