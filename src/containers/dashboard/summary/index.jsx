import React, { useState, useLayoutEffect } from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import { weiToEther } from "../../../utils/conversion";
import BigNumber from "bignumber.js";

export const Summary = ({ balance, fiatValue, symbol, selectedFiat }) => {
    const [etherBalance, setEtherBalance] = useState(new BigNumber("0"));

    useLayoutEffect(() => {
        setEtherBalance(weiToEther(balance));
    }, [balance]);

    return (
        <Flex flexDirection="column" alignItems="center">
            <Box fontSize={[36, 48, 56, 64]} fontWeight={700}>
                {etherBalance.decimalPlaces(4).toString()} {symbol}
            </Box>
            <Box fontSize={[16, 16, 20, 24, 28]}>
                {fiatValue
                    .multipliedBy(etherBalance)
                    .decimalPlaces(2)
                    .toString()}{" "}
                {selectedFiat.symbol}
            </Box>
        </Flex>
    );
};

Summary.propTypes = {
    balance: PropTypes.object.isRequired,
    symbol: PropTypes.string.isRequired,
    fiatValue: PropTypes.object.isRequired,
};
