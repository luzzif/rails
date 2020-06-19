import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { RootContainer } from "./styled";
import { selectedTheme } from "../app";
import { BounceLoader } from "react-spinners";

export const UniversalSpinner = ({ timeout }) => {
    const [open, setOpen] = useState(false);
    let timer = useRef(null);
    const loading = useSelector((state) => !!state.universalLoadings.amount);

    const onTimeout = useCallback(() => {
        setOpen(loading);
        clearTimeout(timer);
    }, [loading, timer]);

    useEffect(() => {
        if (!loading) {
            setOpen(false);
        } else if (!open) {
            timer.current = setTimeout(onTimeout, timeout);
        }
    }, [loading, timeout, open, onTimeout]);

    return (
        <RootContainer open={open} justifyContent="center" alignItems="center">
            <BounceLoader size={120} color={selectedTheme.foreground} loading />
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
