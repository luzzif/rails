import React, {
    useCallback,
    useState,
    useEffect,
    useLayoutEffect,
    Suspense,
    lazy,
} from "react";
import { Layout } from "../../components/layout";
import { ThemeProvider } from "styled-components";
import { PrivateRoute } from "../../components/private-route";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { UniversalSpinner } from "../universal-spinner";
import { GlobalStyle } from "./styled.js";
import { useDispatch } from "react-redux";
import Helmet from "react-helmet";
import {
    getSupportedTokens,
    getUserBalances,
    postSelectedAsset,
    postSelectedFiat,
    postLogout,
} from "../../actions/loopring";
import { BottomUpContainer } from "../../components/bottom-up-container";
import { FiatChooser, supportedFiats } from "../fiat-chooser";
import { ToastContainer, Slide } from "react-toastify";
import darkLogo from "../../images/logo-dark.svg";
import lightLogo from "../../images/logo-light.svg";
import "react-toastify/dist/ReactToastify.css";

const LazyAuth = lazy(() => import("../auth"));
const LazyDashboard = lazy(() => import("../dashboard"));

const commonColors = {
    error: "#c62828",
    success: "#008035",
    warning: "#FF6F00",
};

const light = {
    ...commonColors,
    type: "light",
    background: "#d9d9d9",
    disabled: "#bfbfbf",
    textDisabled: "#8c8c8c",
    foreground: "#f2f2f2",
    primary: "#0e062d",
    secondaryButtonBackground: "rgba(14, 6, 45, 0.2)",
    textInverted: "#e0e0e0",
    text: "#0e062d",
    shadow: "rgba(0, 0, 0, 0.4)",
    placeholder: "#b3b3b3",
    loader: "#a6a6a6",
};

const dark = {
    ...commonColors,
    type: "dark",
    background: "#212121",
    foreground: "#333",
    textDisabled: "#808080",
    disabled: "#4d4d4d",
    primary: "#F1F9D2",
    secondaryButtonBackground: "rgba(241, 249, 210, 0.2)",
    text: "#F1F9D2",
    textInverted: "#212121",
    shadow: "rgba(255, 255, 255, 0.2)",
    placeholder: "#666666",
    loader: "#595959",
};

export let selectedTheme = light;

export const App = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        web3Instance,
        loopringAccountId,
        loopringApiKey,
        loopringExchange,
        supportedTokens,
        balances,
        selectedAsset,
        selectedFiat,
        loadingSupportedTokens,
        loadingBalances,
    } = useSelector((state) => ({
        web3Instance: state.web3.instance,
        loopringAccountId: state.loopring.accountId,
        loopringApiKey: state.loopring.apiKey,
        loopringExchange: state.loopring.exchange,
        supportedTokens: state.loopring.supportedTokens.data,
        balances: state.loopring.balances.data,
        selectedAsset: state.loopring.selectedAsset,
        selectedFiat: state.loopring.selectedFiat,
        loadingSupportedTokens: !!state.loopring.supportedTokens.loadings,
        loadingBalances: !!state.loopring.balances.loadings,
    }));

    const [lightTheme, setLightTheme] = useState(true);
    const [changingFiat, setChangingFiat] = useState(false);
    const [logged, setLogged] = useState(false);
    const [universallyLoading, setUniversallyLoading] = useState(false);

    // setting up local storage -saved theme
    useEffect(() => {
        const cachedTheme = localStorage.getItem("rails-theme") || "light";
        const lightTheme = cachedTheme === "light";
        setLightTheme(lightTheme);
        selectedTheme = lightTheme ? light : dark;
    }, [dispatch]);

    // setting up selected fiat on boot and logout
    useEffect(() => {
        if (selectedFiat) {
            return;
        }
        const fiatFromLocalStorage = localStorage.getItem("rails-fiat");
        dispatch(
            postSelectedFiat(
                fiatFromLocalStorage
                    ? JSON.parse(fiatFromLocalStorage)
                    : supportedFiats[0]
            )
        );
    }, [dispatch, selectedFiat]);

    useEffect(() => {
        if (web3Instance) {
            // only when the wallet has been connected the correct
            // api environment has been selected
            dispatch(getSupportedTokens());
        }
    }, [dispatch, web3Instance]);

    useEffect(() => {
        if (
            loopringApiKey &&
            loopringAccountId &&
            supportedTokens &&
            supportedTokens.length > 0
        ) {
            dispatch(
                getUserBalances(
                    web3Instance,
                    loopringAccountId,
                    loopringApiKey,
                    supportedTokens,
                    selectedFiat
                )
            );
        }
    }, [
        dispatch,
        loopringAccountId,
        loopringApiKey,
        selectedFiat,
        supportedTokens,
        web3Instance,
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

    // shows spinner when logging in and still loading data
    useEffect(() => {
        setUniversallyLoading(
            !logged && (loadingBalances || loadingSupportedTokens)
        );
    }, [loadingBalances, loadingSupportedTokens, logged]);

    useEffect(() => {
        setLogged(
            !!(
                web3Instance &&
                loopringApiKey &&
                loopringAccountId &&
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
        loopringAccountId,
        loopringExchange,
        loopringApiKey,
        selectedAsset,
        supportedTokens,
        web3Instance,
    ]);

    const handleThemeChange = useCallback(() => {
        const newLightTheme = !lightTheme;
        const textTheme = newLightTheme ? "light" : "dark";
        localStorage.setItem("rails-theme", textTheme);
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
            localStorage.setItem("rails-fiat", JSON.stringify(fiat));
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
            <Helmet>
                <link rel="icon" href={lightTheme ? darkLogo : lightLogo} />
                <meta name="theme-color" content={selectedTheme.background} />
            </Helmet>
            <GlobalStyle />
            <Layout
                lightTheme={lightTheme}
                onThemeChange={handleThemeChange}
                // show fiat selector only if actually logged in
                fiat={logged ? selectedFiat : null}
                onFiatClick={handleFiatClick}
                logged={logged}
                onLogoutClick={handleLogoutClick}
            >
                <Suspense fallback={<UniversalSpinner open />}>
                    <Switch>
                        <PrivateRoute
                            path="/dashboard"
                            condition={logged}
                            component={LazyDashboard}
                            redirectTo="/auth"
                        />
                        <Route path="/auth" component={LazyAuth} />
                        <Redirect to="/dashboard" />
                    </Switch>
                </Suspense>
                <BottomUpContainer
                    open={changingFiat}
                    onClose={handleFiatBottomUpContainerClose}
                >
                    <FiatChooser onChange={handleFiatChange} />
                </BottomUpContainer>
            </Layout>
            <UniversalSpinner open={universallyLoading} />
            <ToastContainer
                className="custom-toast-root"
                toastClassName="custom-toast-container"
                bodyClassName="custom-toast-body"
                position="top-right"
                closeButton={false}
                transition={Slide}
                limit="24px"
            />
        </ThemeProvider>
    );
};
