import React from "react";
import PropTypes from "prop-types";
import { StyledImage } from "./styled";
import keepLogo from "../../images/keep.png";
import nestLogo from "../../images/nest.png";
import pNetworkLogo from "../../images/pnetwork.png";

export const TokenIcon = ({ address, size }) => {
    const getIconSource = () => {
        switch (address) {
            case "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC": {
                return keepLogo;
            }
            case "0x04abEdA201850aC0124161F037Efd70c74ddC74C": {
                return nestLogo;
            }
            case "0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD": {
                return pNetworkLogo;
            }
            default: {
                // If the address is ETH, we simply fallback to the WETH icon.
                return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${
                    address === "0x0000000000000000000000000000000000000000"
                        ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                        : address
                }/logo.png`;
            }
        }
    };

    return <StyledImage alt="Icon" size={size} src={getIconSource()} />;
};

TokenIcon.propTypes = {
    address: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
