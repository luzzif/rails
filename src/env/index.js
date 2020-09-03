import env from "@mondora/env";

const NODE_ENV = env("NODE_ENV", { required: true });
if (NODE_ENV !== "production") {
    require("dotenv").config();
}

export const INFURA_ID = env("REACT_APP_INFURA_ID", {
    required: true,
});
