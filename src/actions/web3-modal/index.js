import { web3Modal } from "../../containers/app";

export const changeWeb3ModalTheme = (theme) => async () => {
    try {
        await web3Modal.updateTheme(theme);
    } catch (error) {
        console.error("error changing web3 modal theme", error);
    }
}