import React, { useCallback } from "react";
import { Box } from "reflexbox";
import PropTypes from "prop-types";
import { RootContainer } from "./styled";

export const Wallet = ({ icon, onClick, name }) => {
    const handleLocalClick = useCallback(() => {
        onClick(name);
    }, [name, onClick]);

    return (
        <RootContainer
            width="100%"
            alignItems="center"
            minHeight={60}
            maxHeight={60}
            pl={["16px", "20px"]}
            pr="24px"
            onClick={handleLocalClick}
        >
            <Box pr="16px">{icon}</Box>
            <Box>{name}</Box>
        </RootContainer>
    );
};

Wallet.propTypes = {
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};
