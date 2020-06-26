import React from "react";
import { Container } from "./styled";
import { Box } from "reflexbox";

export const Chip = ({ children, active, dark, onClick }) => (
    <Container active={active} dark={dark} onClick={onClick}>
        <Box>{children}</Box>
    </Container>
);
