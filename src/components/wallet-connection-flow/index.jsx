import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Flex } from "reflexbox";
import { useWeb3Context } from "web3-react";
import { initializeWeb3 } from "../../actions/web3";
import { MetamaskIcon, WalletConnectIcon, AuthereumIcon } from "./styled";
import { Wallet } from "./wallet";
import dxDaoLogo from "../../images/dxdao-blue.svg";

export const WalletConnectionFlow = ({ open }) => {
    const dispatch = useDispatch();
    const {
        active,
        library,
        connectorName,
        setConnector,
        unsetConnector,
        error,
    } = useWeb3Context();
    const metamaskEnabled = "ethereum" in window || "web3" in window;

    useEffect(() => {
        if (!open) {
            unsetConnector();
        }
    }, [open, unsetConnector]);

    useEffect(() => {
        if (active && library) {
            dispatch(initializeWeb3(library, connectorName));
        }
    }, [active, library, dispatch, connectorName]);

    const getWalletClickHandler = (wallet) => () => {
        if (connectorName !== wallet) {
            setConnector(wallet);
        }
    };

    return (
        <Flex flexDirection="column" width="100%">
            {metamaskEnabled && (
                <Box>
                    <Wallet
                        icon={<MetamaskIcon />}
                        onClick={getWalletClickHandler("injected")}
                        name="Metamask"
                    />
                </Box>
            )}
            <Box>
                <Wallet
                    icon={<WalletConnectIcon />}
                    onClick={getWalletClickHandler("walletConnect")}
                    name="WalletConnect"
                />
            </Box>
            <Box>
                <Wallet
                    icon={<AuthereumIcon />}
                    onClick={getWalletClickHandler("authereum")}
                    name="Authereum"
                />
            </Box>
            <Flex justifyContent="center" alignItems="center" mt="16px">
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
