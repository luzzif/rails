import { INITIALIZE_WEB3_SUCCESS } from "../../actions/web3";

const initialState = {
    instance: null,
};

export const web3Reducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case INITIALIZE_WEB3_SUCCESS: {
            return { ...state, instance: action.web3 };
        }
        default: {
            return state;
        }
    }
};
