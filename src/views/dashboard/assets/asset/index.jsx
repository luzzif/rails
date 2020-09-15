import React, { useCallback } from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import { TokenIcon } from "../../../../components/token-icon";
import { RootContainer } from "./styled";
import { formatBigNumber } from "../../../../utils/conversion";

export const Asset = ({ asset, onClick, selectedFiat }) => {
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
                <Box mb="4px">{formatBigNumber(asset.etherBalance)}</Box>
                <Box fontSize={12}>
                    {selectedFiat.symbol}
                    {formatBigNumber(
                        asset.etherBalance.multipliedBy(asset.fiatValue)
                    )}
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
