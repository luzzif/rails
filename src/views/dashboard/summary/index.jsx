import React from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";
import { formatBigNumber } from "../../../utils/conversion";

export const Summary = ({ etherBalance, fiatValue, symbol, selectedFiat }) => {
    return (
        <Flex flexDirection="column" alignItems="center">
            <Flex alignItems="flex-end" mb="8px">
                <Box
                    fontSize={[36, 48, 56, 64]}
                    height={[36, 48, 56, 64]}
                    fontWeight={700}
                    mr="8px"
                >
                    {formatBigNumber(etherBalance, 4)}
                </Box>
                <Box
                    fontSize={[16, 28, 36, 44]}
                    height={[16, 28, 36, 44]}
                    fontWeight={700}
                >
                    {symbol}
                </Box>
            </Flex>
            <Box fontSize={[16, 20, 24, 28, 32]}>
                {selectedFiat.symbol}
                {formatBigNumber(fiatValue.multipliedBy(etherBalance))}
            </Box>
        </Flex>
    );
};

Summary.propTypes = {
    etherBalance: PropTypes.instanceOf(BigNumber).isRequired,
    symbol: PropTypes.string.isRequired,
    fiatValue: PropTypes.object.isRequired,
};
