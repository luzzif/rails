import React from "react";
import PropTypes from "prop-types";
import { Box } from "reflexbox";
import { SearchbarContainer, SearchIconContainer, Input } from "./styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const Searchbar = ({ placeholder, value, onChange, dark }) => (
    <SearchbarContainer
        px="16px"
        height={44}
        width="100%"
        alignItems="center"
        dark={dark}
    >
        <Box mr="12px">
            <SearchIconContainer>
                <FontAwesomeIcon icon={faSearch} />
            </SearchIconContainer>
        </Box>
        <Box width="100%">
            <Input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                dark={dark}
            />
        </Box>
    </SearchbarContainer>
);

Searchbar.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dark: PropTypes.bool,
};
