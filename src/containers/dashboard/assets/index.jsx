import React, { useState, useCallback, useEffect } from "react";
import { Flex, Box } from "reflexbox";
import PropTypes from "prop-types";
import { Asset } from "./asset";
import { useIntl, FormattedMessage } from "react-intl";
import { Searchbar } from "../../../components/searchbar";
import { ActionButton } from "../../../components/action-button";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { OverlayBox } from "./styled";
import { BounceLoader } from "react-spinners";
import { selectedTheme } from "../../app";
import { useSelector } from "react-redux";

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
        <Flex mx={[3, 4]} flexDirection="column" width="100%">
            <Flex mb={3}>
                <Box width="100%" pr={3}>
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
                        size={44}
                        faIconSize={20}
                        onClick={onRefresh}
                    />
                </Box>
            </Flex>
            <Flex mb={3} width="100%" flexDirection="column" overflowY="scroll">
                {filteredAssets && filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                        <Asset
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
            <OverlayBox
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                open={balancesLoading}
            >
                <BounceLoader size={60} color={selectedTheme.loader} loading />
            </OverlayBox>
        </Flex>
    );
};

Assets.propTypes = {
    assets: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
};
