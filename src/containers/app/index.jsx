import React, {
    useCallback,
    useState,
    useEffect,
    useLayoutEffect,
} from "react";
import { Dashboard } from "../dashboard";
import { Layout } from "../../components/layout";
import { ThemeProvider } from "styled-components";
import { PrivateRoute } from "../../components/private-route";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { UniversalSpinner } from "../universal-spinner";
import { GlobalStyle } from "./styled.js";
import { useDispatch } from "react-redux";
import { Auth } from "../auth";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { INFURA_ID } from "../../env";
import {
    getSupportedTokens,
    getUserBalances,
    postSelectedAsset,
    postSelectedFiat,
    postLogout,
} from "../../actions/loopring";
import { BottomUpContainer } from "../../components/bottom-up-container";
import { FiatChooser, supportedFiats } from "../fiat-chooser";

const commonColors = {
    error: "#ff1744",
    primary: "#cb014e",
};

const light = {
    ...commonColors,
    background: "#e0e0e0",
    foreground: "#f2f2f2",
    text: "#0e062d",
    shadow: "rgba(0, 0, 0, 0.4)",
    placeholder: "#b3b3b3",
    loader: "#a6a6a6",
};

const dark = {
    ...commonColors,
    background: "#212121",
    foreground: "#333",
    text: "#F1F9D2",
    shadow: "rgba(255, 255, 255, 0.4)",
    placeholder: "#666666",
    loader: "#595959",
};

const web3ModalOptions = {
    cacheProvider: true,
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: INFURA_ID,
            },
        },
    },
};

export const getWeb3Modal = () => new Web3Modal(web3ModalOptions);

export let selectedTheme = light;

export const App = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        web3Instance,
        loopringAccount,
        loopringWallet,
        loopringExchange,
        supportedTokens,
        balances,
        selectedAsset,
        selectedFiat,
    } = useSelector((state) => ({
        web3Instance: state.web3.instance,
        loopringAccount: state.loopring.account,
        loopringWallet: state.loopring.wallet,
        loopringExchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens,
        balances: state.loopring.balances.data,
        selectedAsset: state.loopring.selectedAsset,
        selectedFiat: state.loopring.selectedFiat,
    }));

    const [lightTheme, setLightTheme] = useState(true);
    const [changingFiat, setChangingFiat] = useState(false);
    const [logged, setLogged] = useState(false);

    // setting up local storage -saved theme
    useEffect(() => {
        const cachedTheme =
            localStorage.getItem("loopring-pay-theme") || "light";
        const lightTheme = cachedTheme === "light";
        setLightTheme(lightTheme);
        selectedTheme = lightTheme ? light : dark;
        web3ModalOptions.theme = cachedTheme;
    }, [dispatch]);

    // setting up selected fiat on boot and logout
    useEffect(() => {
        if (selectedFiat) {
            return;
        }
        const fiatFromLocalStorage = localStorage.getItem("loopring-pay-fiat");
        dispatch(
            postSelectedFiat(
                fiatFromLocalStorage
                    ? JSON.parse(fiatFromLocalStorage)
                    : supportedFiats[0]
            )
        );
    }, [dispatch, selectedFiat]);

    useEffect(() => {
        if (loopringWallet && loopringAccount) {
            dispatch(getSupportedTokens());
        }
    }, [history, dispatch, loopringAccount, loopringWallet]);

    useEffect(() => {
        if (
            loopringWallet &&
            loopringAccount &&
            supportedTokens &&
            supportedTokens.length > 0
        ) {
            dispatch(
                getUserBalances(
                    loopringAccount,
                    loopringWallet,
                    supportedTokens,
                    selectedFiat
                )
            );
        }
    }, [
        dispatch,
        supportedTokens,
        loopringAccount,
        loopringWallet,
        selectedFiat,
    ]);

    // setting the default-selected asset (the one with the most fiat value)
    useEffect(() => {
        if (balances && balances.length > 0 && selectedAsset === null) {
            const firstNonZeroBalance = balances.find(
                (balance) => !balance.balance.isZero()
            );
            dispatch(postSelectedAsset(firstNonZeroBalance || balances[0]));
        }
    }, [balances, dispatch, selectedAsset, supportedTokens]);

    useLayoutEffect(() => {
        history.push(logged ? "/dashboard" : "/auth");
    }, [history, logged]);

    useEffect(() => {
        setLogged(
            !!(
                web3Instance &&
                loopringAccount &&
                loopringWallet &&
                loopringExchange &&
                supportedTokens &&
                supportedTokens.length > 0 &&
                balances &&
                balances.length > 0 &&
                selectedAsset
            )
        );
    }, [
        balances,
        loopringAccount,
        loopringExchange,
        loopringWallet,
        selectedAsset,
        supportedTokens,
        web3Instance,
    ]);

    const handleThemeChange = useCallback(() => {
        const newLightTheme = !lightTheme;
        const textTheme = newLightTheme ? "light" : "dark";
        localStorage.setItem("loopring-pay-theme", textTheme);
        web3ModalOptions.theme = textTheme;
        setLightTheme(newLightTheme);
        selectedTheme = newLightTheme ? light : dark;
    }, [lightTheme]);

    const handleFiatClick = useCallback(() => {
        setChangingFiat(true);
    }, []);

    const handleFiatBottomUpContainerClose = useCallback(() => {
        setChangingFiat(false);
    }, []);

    const handleFiatChange = useCallback(
        (fiat) => {
            localStorage.setItem("loopring-pay-fiat", JSON.stringify(fiat));
            dispatch(postSelectedFiat(fiat));
            setChangingFiat(false);
        },
        [dispatch]
    );

    const handleLogoutClick = useCallback(() => {
        dispatch(postLogout());
    }, [dispatch]);

    return (
        <ThemeProvider theme={lightTheme ? light : dark}>
            <GlobalStyle />
            <Layout
                lightTheme={lightTheme}
                onThemeChange={handleThemeChange}
                fiat={selectedFiat}
                onFiatClick={handleFiatClick}
                logged={logged}
                onLogoutClick={handleLogoutClick}
            >
                <Switch>
                    <PrivateRoute
                        path="/dashboard"
                        condition={logged}
                        component={Dashboard}
                        redirectTo="/auth"
                    />
                    <Route path="/auth" component={Auth} />
                    <Redirect to="/dashboard" />
                </Switch>
                <BottomUpContainer
                    open={changingFiat}
                    onClose={handleFiatBottomUpContainerClose}
                >
                    <FiatChooser onChange={handleFiatChange} />
                </BottomUpContainer>
            </Layout>
            <UniversalSpinner />
        </ThemeProvider>
    );
};
