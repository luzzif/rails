import env from "@mondora/env";

const NODE_ENV = env("NODE_ENV", { required: true });
if (NODE_ENV !== "production") {
    require("dotenv").config();
}

export const PROVIDER_URL = env("REACT_APP_PROVIDER_URL", {
    required: true,
});

export const CHAIN_ID = env("REACT_APP_CHAIN_ID", {
    required: true,
    parse: parseInt
});
