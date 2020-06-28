import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "reflexbox";
import { FormattedMessage } from "react-intl";
import { Button } from "../../../../../components/button";
import { getEtherscanLink } from "../../../../../lightcone/api/localStorgeAPI";
import { CHAIN_ID } from "../../../../../env";

export const AllowanceConfirmation = ({ asset, transactionHash }) => (
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
            <Button
                link
                external
                href={`${getEtherscanLink(CHAIN_ID)}/tx/${transactionHash}`}
            >
                <FormattedMessage id="deposit.allowance.confirmation.button.title" />
            </Button>
        </Box>
    </Flex>
);

AllowanceConfirmation.propTypes = {
    asset: PropTypes.object.isRequired,
    transactionHash: PropTypes.string.isRequired,
};
