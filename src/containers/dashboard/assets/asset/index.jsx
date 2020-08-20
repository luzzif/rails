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
            pl={["16px", "20px"]}
            pr="24px"
            onClick={handleLocalClick}
        >
            <Box pr="16px">
                <TokenIcon address={asset.address} size={48} />
            </Box>
            <Box flexGrow="1">{asset.symbol}</Box>
            <Flex
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="center"
            >
                <Box mb="4px">{etherBalance.decimalPlaces(4).toString()}</Box>
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
    selectedFiat: PropTypes.object.isRequired,
    mb: PropTypes.number.isRequired,
};
