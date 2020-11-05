import React, { useState, useCallback, useEffect } from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import { Asset } from "./asset";
import { useIntl, FormattedMessage } from "react-intl";
import { Searchbar } from "../../../components/searchbar";
import { ActionButton } from "../../../components/action-button";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { LoadingOverlay } from "../../../components/loading-overlay";

export const Assets = ({ assets, onChange, onRefresh, open, selectedFiat }) => {
    const { formatMessage } = useIntl();
    const { balancesLoading } = useSelector((state) => ({
        balancesLoading: !!state.loopring.balances.loadings,
    }));

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
        <Flex flexDirection="column" width="100%">
            <Flex mb="16px">
                <Box width="100%" mr="16px">
                    <Searchbar
                        placeholder={formatMessage({
                            id: "dashboard.assets.search",
                        })}
                        value={query}
                        onChange={handleQueryChange}
                    />
                </Box>
                <Box minWidth="auto">
                    <ActionButton
                        faIcon={faRedo}
                        size={40}
                        faIconSize={16}
                        onClick={onRefresh}
                    />
                </Box>
            </Flex>
            <Flex
                width="100%"
                flexDirection="column"
                overflowY="auto"
                pb="24px"
            >
                {filteredAssets && filteredAssets.length > 0 ? (
                    filteredAssets.map((asset, index) => (
                        <Asset
                            mb={index === filteredAssets.length - 1 ? 3 : 0}
                            key={asset.id}
                            asset={asset}
                            onClick={onChange}
                            selectedFiat={selectedFiat}
                        />
                    ))
                ) : (
                    <Box
                        minHeight={68}
                        maxHeight={68}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <FormattedMessage id="dashboard.assets.empty" />
                    </Box>
                )}
            </Flex>
            <LoadingOverlay open={balancesLoading} />
        </Flex>
    );
};

Assets.propTypes = {
    assets: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
};
