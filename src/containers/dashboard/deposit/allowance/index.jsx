import React from "react";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { Button } from "../../../../components/button";
import { useDispatch, useSelector } from "react-redux";
import { grantAllowance } from "../../../../actions/loopring";

export const Allowance = ({ asset }) => {
    const dispatch = useDispatch();
    const { loopringWallet, loopringExchange } = useSelector((state) => ({
        loopringWallet: state.loopring.wallet,
        loopringExchange: state.loopring.exchange,
    }));

    const handleClick = useCallback(() => {
        dispatch(
            grantAllowance(
                loopringWallet,
                loopringExchange,
                asset.symbol,
                asset.address
            )
        );
    }, [
        asset.address,
        asset.symbol,
        dispatch,
        loopringExchange,
        loopringWallet,
    ]);

    return (
        <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={4}
            pt={1}
            px={4}
        >
            <Box mb={3} width="100%">
                <FormattedMessage
                    id="deposit.allowance.message"
                    values={{ tokenSymbol: asset.symbol }}
                />
            </Box>
            <Box>
                <Button onClick={handleClick}>
                    <FormattedMessage id="deposit.allowance.button.title" />
                </Button>
            </Box>
        </Flex>
    );
};

Allowance.propTypes = {
    asset: PropTypes.object.isRequired,
};
