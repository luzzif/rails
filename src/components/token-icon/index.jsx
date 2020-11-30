import React from "react";
import PropTypes from "prop-types";
import { StyledImage } from "./styled";

export const TokenIcon = ({ address, size }) => {
    return (
        <StyledImage
            alt="Icon"
            size={size}
            src={`https://v1.loopring.io/assets/images/ethereum/assets/${
                address === "0x0000000000000000000000000000000000000000"
                    ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                    : address
            }/logo.png`}
        />
    );
};

TokenIcon.propTypes = {
    address: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
