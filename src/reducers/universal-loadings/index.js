import {
    POST_UNIVERSAL_LOADING,
    DELETE_UNIVERSAL_LOADING,
} from "../../actions/universal-loadings";

export const universalLoadingsReducer = (state = { amount: 0 }, action) => {
    switch (action.type) {
        case POST_UNIVERSAL_LOADING: {
            return { amount: state.amount + 1 };
        }
        case DELETE_UNIVERSAL_LOADING: {
            return { amount: state.amount > 0 ? state.amount - 1 : 0 };
        }
        default: {
            return state;
        }
    }
};
