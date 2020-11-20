import React, { useCallback } from "react";
import { Box, Flex } from "reflexbox";
import {
    MetamaskIcon,
    StatusIcon,
    WalletConnectIcon,
    AuthereumIcon,
} from "./styled";
import { Wallet } from "./wallet";
import dxDaoLogo from "../../images/dxdao-blue.svg";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { initializeWeb3 } from "../../actions/web3";
import WalletConnectWeb3Provider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import { INFURA_PROJECT_ID } from "../../commons";

export const WalletConnectionFlow = () => {
    const dispatch = useDispatch();

    const injectedEnabled = window.ethereum || window.web3;
    const isStatus = window.ethereum && window.ethereum.isStatus;

    const handleInjectedClick = useCallback(() => {
        if (!injectedEnabled) {
            toast.error(<FormattedMessage id="error.wallet.connect" />);
        }
        delete window.send;
        const provider = window.ethereum;
        dispatch(initializeWeb3(provider));
    }, [dispatch, injectedEnabled]);

    const handleWalletConnectClick = useCallback(() => {
        const provider = new WalletConnectWeb3Provider({
            infuraId: INFURA_PROJECT_ID,
        });
        // FIXME: hack. See https://github.com/WalletConnect/walletconnect-monorepo/issues/384
        window.send = (e, t) => provider.send(e, t);
        dispatch(initializeWeb3(provider));
    }, [dispatch]);

    const handleAuthereumClick = useCallback(() => {
        delete window.send;
        dispatch(initializeWeb3(new Authereum().getProvider()));
    }, [dispatch]);

    return (
        <Flex flexDirection="column" width="100%">
            {injectedEnabled && (
                <Box>
                    <Wallet
                        icon={isStatus ? <StatusIcon /> : <MetamaskIcon />}
                        onClick={handleInjectedClick}
                        name={isStatus ? "Status" : "Metamask"}
                    />
                </Box>
            )}
            <Box>
                <Wallet
                    icon={<WalletConnectIcon />}
                    onClick={handleWalletConnectClick}
                    name="WalletConnect"
                />
            </Box>
            <Box>
                <Wallet
                    icon={<AuthereumIcon />}
                    onClick={handleAuthereumClick}
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
