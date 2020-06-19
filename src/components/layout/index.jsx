import React from "react";
import { Toolbar } from "./toolbar";
import PropTypes from "prop-types";
import { Root } from "./styled";

export const Layout = ({ lightTheme, children, onThemeChange }) => (
    <Root>
        <Toolbar lightTheme={lightTheme} onThemeChange={onThemeChange} />
        {children}
    </Root>
);

Layout.propTypes = {
    lightTheme: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onThemeChange: PropTypes.func.isRequired,
};
