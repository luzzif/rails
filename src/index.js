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
            <HashRouter>
                <App />
            </HashRouter>
        </IntlProvider>
    </Provider>,
    document.getElementById("root")
);
