import React from "react";
import { Toolbar } from "./toolbar";
import PropTypes from "prop-types";
import { Root } from "./styled";

export const Layout = ({
    lightTheme,
    children,
    onThemeChange,
    fiat,
    onFiatClick,
}) => (
    <Root>
        <Toolbar
            lightTheme={lightTheme}
            onThemeChange={onThemeChange}
            fiat={fiat}
            onFiatClick={onFiatClick}
        />
        {children}
    </Root>
);

Layout.propTypes = {
    lightTheme: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onThemeChange: PropTypes.func.isRequired,
    fiat: PropTypes.object,
    onFiatClick: PropTypes.func.isRequired,
};
