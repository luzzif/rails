import { Flex, Box } from "reflexbox";

import React from "react";
import PropTypes from "prop-types";
import { Fiat } from "./fiat";
import {
    faEuroSign,
    faDollarSign,
    faPoundSign,
    faYenSign,
} from "@fortawesome/free-solid-svg-icons";

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
    {
        symbol: "£",
        name: "GBP",
        faIcon: faPoundSign,
    },
    {
        symbol: "¥",
        name: "JPY",
        faIcon: faYenSign,
    },
    {
        symbol: "¥",
        name: "CNY",
        faIcon: faYenSign,
    },
    {
        symbol: "$",
        name: "HKD",
        faIcon: faDollarSign,
    },
];

export const FiatChooser = ({ onChange }) => (
    <Flex flexDirection="column" width="100%">
        {supportedFiats.map((fiat) => (
            <Box
                key={fiat.name}
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
