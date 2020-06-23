import { Flex, Box } from "reflexbox";

import React from "react";
import PropTypes from "prop-types";
import { Fiat } from "./fiat";
import { faEuroSign, faDollarSign } from "@fortawesome/free-solid-svg-icons";

export const supportedFiats = [
    {
        symbol: "$",
        name: "USD",
        faIcon: faDollarSign,
    },
    {
        symbol: "€",
        name: "EUR",
        faIcon: faEuroSign,
    },
];

export const FiatChooser = ({ onChange }) => (
    <Flex flexDirection="column" width="100%" pb={4} px={2}>
        {supportedFiats.map((fiat) => (
            <Box
                key={fiat.name}
                height={68}
                width="100%"
                alignItems="center"
                display="flex"
            >
                <Fiat fiat={fiat} onClick={onChange} />
            </Box>
        ))}
    </Flex>
);

FiatChooser.propTypes = {
    onChange: PropTypes.func.isRequired,
};
