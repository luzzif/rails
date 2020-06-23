import React from "react";
import PropTypes from "prop-types";
import { FlexContainer, Logo } from "./styled";
import { Box, Flex } from "reflexbox";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import lightLogo from "../../../images/logo/light.svg";
import darkLogo from "../../../images/logo/dark.svg";
import { ActionButton } from "../../action-button";

export const Toolbar = ({ lightTheme, onThemeChange, fiat, onFiatClick }) => (
    <FlexContainer
        px={20}
        py={3}
        alignItems="center"
        justifyContent="space-between"
        width="100vw"
    >
        <Box>
            <Logo src={lightTheme ? darkLogo : lightLogo} />
        </Box>
        <Flex alignItems="center" height="100%">
            {fiat && (
                <Box minWidth="auto" mr={[2, 3]}>
                    <ActionButton
                        onClick={onFiatClick}
                        faIcon={fiat.faIcon}
                        size={48}
                        faIconSize={20}
                    />
                </Box>
            )}
            <Box minWidth="auto">
                <ActionButton
                    onClick={onThemeChange}
                    faIcon={lightTheme ? faMoon : faSun}
                    size={48}
                    faIconSize={20}
                />
            </Box>
        </Flex>
    </FlexContainer>
);

Toolbar.propTypes = {
    lightTheme: PropTypes.bool.isRequired,
    onThemeChange: PropTypes.func.isRequired,
    fiat: PropTypes.object,
    onFiatClick: PropTypes.func.isRequired,
};
