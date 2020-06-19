import React from "react";
import PropTypes from "prop-types";
import { StyledImage } from "./styled";
import keepLogo from "../../images/keep.png";

// If the address is ETH, we simply fallback to the WETH icon.
// For KEEP, we use a custom icon
export const TokenIcon = ({ address, size }) => (
    <StyledImage
        alt="Icon"
        size={size}
        src={
            address === "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC"
                ? keepLogo
                : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${
                      address === "0x0000000000000000000000000000000000000000"
                          ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                          : address
                  }/logo.png`
        }
    />
);

TokenIcon.propTypes = {
    address: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
