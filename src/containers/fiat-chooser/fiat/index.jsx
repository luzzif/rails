import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Box } from "reflexbox";
import { OneLineText, HoverableContainer } from "./styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Fiat = ({ fiat, onClick }) => {
    const { faIcon, name } = fiat;

    const handleLocalClick = useCallback(() => {
        onClick(fiat);
    }, [fiat, onClick]);

    return (
        <HoverableContainer
            alignItems="center"
            pl="16px"
            width="100%"
            height="100%"
            minHeight={68}
            maxHeight={68}
            onClick={handleLocalClick}
        >
            <Box
                pr="16px"
                height={48}
                width={48}
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize={20}
            >
                <FontAwesomeIcon icon={faIcon} />
            </Box>
            <Box>
                <OneLineText>{name}</OneLineText>
            </Box>
        </HoverableContainer>
    );
};

Fiat.propTypes = {
    fiat: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
