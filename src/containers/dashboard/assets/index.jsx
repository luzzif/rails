import React, { useState, useCallback, useEffect } from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import { Asset } from "./asset";
import { useIntl } from "react-intl";
import { Searchbar } from "../../../components/searchbar";

export const Assets = ({ assets, onChange, open }) => {
    const { formatMessage } = useIntl();

    const [query, setQuery] = useState("");
    const [filteredAssets, setFilteredAssets] = useState(assets);

    useEffect(() => {
        if (!open) {
            setQuery("");
        }
    }, [open]);

    useEffect(() => {
        setFilteredAssets(
            !assets
                ? assets
                : assets.filter((asset) => {
                      const lowerCasedSearchTerm = query.toLowerCase();
                      return (
                          asset.symbol
                              .toLowerCase()
                              .includes(lowerCasedSearchTerm) ||
                          asset.name
                              .toLowerCase()
                              .includes(lowerCasedSearchTerm) ||
                          asset.address
                              .toLowerCase()
                              .includes(lowerCasedSearchTerm)
                      );
                  })
        );
    }, [assets, query]);

    const handleQueryChange = useCallback((event) => {
        setQuery(event.target.value);
    }, []);

    return (
        <Flex mx={[3, 4]} flexDirection="column" width="100%">
            <Flex mb={3}>
                <Box width="100%">
                    <Searchbar
                        placeholder={formatMessage({
                            id: "dashboard.assets.search",
                        })}
                        value={query}
                        onChange={handleQueryChange}
                    />
                </Box>
            </Flex>
            <Flex width="100%" flexDirection="column" overflowY="scroll">
                {filteredAssets.map((asset) => (
                    <Asset key={asset.id} asset={asset} onClick={onChange} />
                ))}
            </Flex>
        </Flex>
    );
};

Assets.propTypes = {
    assets: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};
