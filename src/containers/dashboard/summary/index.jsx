import React from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";
import { formatBigNumber } from "../../../utils/conversion";

export const Summary = ({ etherBalance, fiatValue, symbol, selectedFiat }) => {
    return (
        <Flex flexDirection="column" alignItems="center">
            <Box fontSize={[36, 48, 56, 64]} fontWeight={700}>
                {formatBigNumber(etherBalance)} {symbol}
            </Box>
            <Box fontSize={[16, 16, 20, 24, 28]}>
                {formatBigNumber(fiatValue.multipliedBy(etherBalance))}{" "}
                {selectedFiat.symbol}
            </Box>
        </Flex>
    );
};

Summary.propTypes = {
    etherBalance: PropTypes.instanceOf(BigNumber).isRequired,
    symbol: PropTypes.string.isRequired,
    fiatValue: PropTypes.object.isRequired,
};
