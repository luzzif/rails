export const weiToEther = (weiBigNumber, tokendIdOrSymbol, supportedTokens) => {
    const token = supportedTokens.find(
        (token) =>
            token.tokenId === tokendIdOrSymbol ||
            token.symbol === tokendIdOrSymbol
    );
    return weiBigNumber.dividedBy("1e" + token.decimals);
};

export const formatBigNumber = (decimal, significantDecimalPlaces = 2) => {
    const decimalPlaces = decimal.decimalPlaces();
    if (decimalPlaces === 0) {
        return formatIntegerString(decimal.toString());
    }
    const [integers, decimals] = decimal.toFixed(decimalPlaces).split(".");
    let adjustedDecimals = "";
    let significantDecimalPlacesAdded = 0;
    for (let i = 0; i < decimals.length; i++) {
        const char = decimals.charAt(i);
        if (significantDecimalPlacesAdded === 1 && char === "0") {
            // handle cases like 0.0010001, stopping at the first 1
            break;
        }
        adjustedDecimals += char;
        if (
            char !== "0" &&
            ++significantDecimalPlacesAdded === significantDecimalPlaces
        ) {
            break;
        }
    }
    return `${formatIntegerString(integers)}.${adjustedDecimals}`;
};

const formatIntegerString = (integer) => {
    let adjustedInteger = "";
    let j = 0;
    for (let i = integer.length - 1; i >= 0; i--) {
        const char = integer.charAt(j);
        if ((i + 1) % 3 === 0 && j !== 0) {
            adjustedInteger += ",";
        }
        adjustedInteger += char;
        j++;
    }
    return adjustedInteger;
};

export const getShortenedEthereumAddress = (address) =>
    `${address.substring(0, 5)}...${address.substring(
        address.length - 6,
        address.length - 1
    )}`;
