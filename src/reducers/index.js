import { combineReducers } from "redux";
import { universalLoadingsReducer } from "./universal-loadings";
import { loopringReducer } from "./loopring";
import { ensReducer } from "./ens";

export const reducers = combineReducers({
    loopring: loopringReducer,
    universalLoadings: universalLoadingsReducer,
    ens: ensReducer,
});
