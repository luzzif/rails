import React from "react";
import PropTypes from "prop-types";
import { Container } from "./styled";
import { Box } from "reflexbox";

export const Chip = ({ children, active, dark, onClick }) => (
    <Container active={active} dark={dark} onClick={onClick}>
        <Box>{children}</Box>
    </Container>
);

Chip.propTypes = {
    children: PropTypes.node.isRequired,
    active: PropTypes.bool.isRequired,
    dark: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};
