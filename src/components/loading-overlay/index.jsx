import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { OverlayFlex } from "./styled";
import { Box } from "reflexbox";

export const LoadingOverlay = ({ open, light }) => (
    <OverlayFlex
        justifyContent="center"
        alignItems="center"
        open={open}
        light={light}
    >
        <Box>
            <FontAwesomeIcon spin icon={faCircleNotch} />
        </Box>
    </OverlayFlex>
);

LoadingOverlay.propTypes = {
    open: PropTypes.bool.isRequired,
    light: PropTypes.bool,
};
