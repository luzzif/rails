export const findTokenBySymbol = (tokens, symbol) =>
    tokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
