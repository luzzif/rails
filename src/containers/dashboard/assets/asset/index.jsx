import React, { useLayoutEffect, useState, useCallback } from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";
import { weiToEther } from "../../../../utils/conversion";
import { TokenIcon } from "../../../../components/token-icon";
import { RootContainer } from "./styled";

export const Asset = ({ asset, onClick, selectedFiat }) => {
    const [etherBalance, setEtherBalance] = useState(new BigNumber("0"));

    useLayoutEffect(() => {
        setEtherBalance(weiToEther(asset.balance));
    }, [asset]);

    const handleLocalClick = useCallback(() => {
        onClick(asset);
    }, [asset, onClick]);

    return (
        <RootContainer
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            minHeight={68}
            maxHeight={68}
            px={3}
            onClick={handleLocalClick}
        >
            <Flex alignItems="center">
                <Box mr={3}>
                    <TokenIcon address={asset.address} size={48} />
                </Box>
                <Box>{asset.symbol}</Box>
            </Flex>
            <Flex
                p={3}
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="center"
            >
                <Box mb={1}>{etherBalance.decimalPlaces(4).toString()}</Box>
                <Box fontSize={12}>
                    {etherBalance
                        .multipliedBy(asset.fiatValue)
                        .decimalPlaces(2)
                        .toString()}{" "}
                    {selectedFiat.symbol}
                </Box>
            </Flex>
        </RootContainer>
    );
};

Asset.propTypes = {
    asset: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
};
