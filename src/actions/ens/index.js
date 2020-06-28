export const POST_GET_ADDRESS_LOADING = "POST_GET_ADDRESS_LOADING";
export const DELETE_GET_ADDRESS_LOADING = "DELETE_GET_ADDRESS_LOADING";
export const GET_ADDRESS_SUCCESS = "GET_ADDRESS_SUCCESS";
export const GET_ADDRESS_FAILURE = "GET_ADDRESS_FAILURE";

export const getAddressFromEnsName = (wallet, name) => async (dispatch) => {
    dispatch({ type: POST_GET_ADDRESS_LOADING });
    try {
        dispatch({
            type: GET_ADDRESS_SUCCESS,
            address: await wallet.web3.eth.ens.getAddress(name),
        });
    } catch (error) {
        dispatch({ type: GET_ADDRESS_FAILURE });
    }
    dispatch({ type: DELETE_GET_ADDRESS_LOADING });
};
