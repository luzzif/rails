import { combineReducers } from "redux";
import { loopringReducer } from "./loopring";
import { ensReducer } from "./ens";
import { web3Reducer } from "./web3";

export const reducers = combineReducers({
    loopring: loopringReducer,
    ens: ensReducer,
    web3: web3Reducer,
});
