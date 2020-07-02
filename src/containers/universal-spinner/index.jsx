import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { RootContainer } from "./styled";
import { selectedTheme } from "../app";
import { BounceLoader } from "react-spinners/BounceLoader";

export const UniversalSpinner = ({ timeout, open }) => {
    const [locallyOpen, setLocallyOpen] = useState(false);
    let timer = useRef(null);

    const onTimeout = useCallback(() => {
        setLocallyOpen(open);
        clearTimeout(timer);
    }, [open, timer]);

    useEffect(() => {
        if (!open) {
            setLocallyOpen(false);
        } else if (!locallyOpen) {
            timer.current = setTimeout(onTimeout, timeout);
        }
    }, [open, timeout, onTimeout, locallyOpen]);

    return (
        <RootContainer
            open={locallyOpen}
            justifyContent="center"
            alignItems="center"
        >
            <BounceLoader size={80} color={selectedTheme.loader} loading />
        </RootContainer>
    );
};

UniversalSpinner.propTypes = {
    loading: PropTypes.bool,
    timeout: PropTypes.number,
};

UniversalSpinner.defaultProps = {
    timeout: 200,
};
