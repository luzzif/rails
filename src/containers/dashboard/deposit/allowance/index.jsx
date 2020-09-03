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
    const { web3Instance, ethereumAccount, loopringExchange } = useSelector(
        (state) => ({
            web3Instance: state.web3.instance,
            ethereumAccount: state.web3.selectedAccount,
            loopringExchange: state.loopring.exchange,
        })
    );

    const handleClick = useCallback(() => {
        dispatch(
            grantAllowance(
                web3Instance,
                ethereumAccount,
                loopringExchange,
                asset
            )
        );
    }, [asset, dispatch, ethereumAccount, loopringExchange, web3Instance]);

    return (
        <Flex
            width="100%"
            height="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Box mb="24px" width="100%">
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
