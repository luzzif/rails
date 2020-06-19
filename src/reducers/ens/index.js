import {
    POST_GET_ADDRESS_LOADING,
    DELETE_GET_ADDRESS_LOADING,
    GET_ADDRESS_SUCCESS,
    GET_ADDRESS_FAILURE,
} from "../../actions/ens";

const initialState = {
    address: null,
    loadings: 0,
};

export const ensReducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case POST_GET_ADDRESS_LOADING: {
            return {
                ...state,
                loadings: state.loadings + 1,
            };
        }
        case DELETE_GET_ADDRESS_LOADING: {
            return {
                ...state,
                loadings: state.loadings - 1,
            };
        }
        case GET_ADDRESS_SUCCESS: {
            return {
                ...state,
                address: action.address,
            };
        }
        case GET_ADDRESS_FAILURE: {
            return {
                ...state,
                address: null,
            };
        }
        default: {
            return state;
        }
    }
};
