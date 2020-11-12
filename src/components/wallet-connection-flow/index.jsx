import React, { useEffect } from "react";
import { Box, Flex } from "reflexbox";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { MetamaskIcon, WalletConnectIcon, AuthereumIcon } from "./styled";
import { Wallet } from "./wallet";
import dxDaoLogo from "../../images/dxdao-blue.svg";
import {
    authereumConnector,
    injectedConnector,
    walletConnectConnector,
} from "../../connectors";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

export const WalletConnectionFlow = ({ open }) => {
    const { connector, activate, deactivate, error } = useWeb3React();
    const injectedEnabled = "ethereum" in window || "web3" in window;

    useEffect(() => {
        if (!open) {
            deactivate();
        }
    }, [open, deactivate]);

    useEffect(() => {
        if (error && error instanceof UnsupportedChainIdError) {
            toast.error(<FormattedMessage id="auth.chain.invalid" />);
        }
    }, [open, error]);

    const getWalletClickHandler = (newConnector) => () => {
        if (connector !== newConnector) {
            activate(newConnector);
        }
    };

    return (
        <Flex flexDirection="column" width="100%">
            {injectedEnabled && (
                <Box>
                    <Wallet
                        icon={<MetamaskIcon />}
                        onClick={getWalletClickHandler(injectedConnector)}
                        name="Metamask"
                    />
                </Box>
            )}
            <Box>
                <Wallet
                    icon={<WalletConnectIcon />}
                    onClick={getWalletClickHandler(walletConnectConnector)}
                    name="WalletConnect"
                />
            </Box>
            <Box>
                <Wallet
                    icon={<AuthereumIcon />}
                    onClick={getWalletClickHandler(authereumConnector)}
                    name="Authereum"
                />
            </Box>
            <Flex justifyContent="center" alignItems="center" mt="24px">
                <Flex mr="8px">
                    <img
                        src={dxDaoLogo}
                        width="16px"
                        height="16px"
                        alt="DXdao logo"
                    />
                </Flex>
                <Box fontSize="12px">Made by DXdao</Box>
            </Flex>
        </Flex>
    );
};
