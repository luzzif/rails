import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RootContainer } from "./styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useDebouncedCallback } from "use-debounce/lib";

export const UniversalSpinner = ({ timeout, open }) => {
    const [locallyOpen, setLocallyOpen] = useState(false);

    const [debouncedSetLocallyOpen] = useDebouncedCallback(
        setLocallyOpen,
        timeout
    );

    useEffect(() => {
        if (!open) {
            setLocallyOpen(false);
        } else if (!locallyOpen) {
            debouncedSetLocallyOpen(open);
        }
    }, [debouncedSetLocallyOpen, locallyOpen, open]);

    return (
        <RootContainer
            open={locallyOpen}
            justifyContent="center"
            alignItems="center"
        >
            <FontAwesomeIcon icon={faCircleNotch} spin />
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
