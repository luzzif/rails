import { getApiKey } from "../../lightcone/api/LightconeAPI";

export const getLoopringApiKey = async (wallet, account) => {
    const { signature } = wallet.getApiKey();
    return getApiKey(
        {
            accountId: account.accountId,
            publicKeyX: account.publicKeyX,
            publicKeyY: account.publicKeyY,
        },
        signature
    );
}