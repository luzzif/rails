import React from "react";
import ReactDOM from "react-dom";
import { App } from "./views/app";
import { HashRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import en from "./i18n/en.json";
import { getLanguage } from "./utils/localization";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { reducers } from "./reducers";
import { version } from "../package.json";
import Web3Provider from "web3-react";
import Web3 from "web3";
import {
    injectedConnector,
    walletConnectProvider,
    authereumConnector,
} from "./connectors";

console.log(`Welcome to Rails version ${version}`);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const messages = { en };
let language = getLanguage();
if (!(language in messages)) {
    language = "en";
}

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={language} messages={messages[language]}>
            <Web3Provider
                connectors={{
                    injected: injectedConnector,
                    walletConnect: walletConnectProvider,
                    authereum: authereumConnector,
                }}
                libraryName="web3.js"
                web3Api={Web3}
            >
                <HashRouter>
                    <App />
                </HashRouter>
            </Web3Provider>
        </IntlProvider>
    </Provider>,
    document.getElementById("root")
);
