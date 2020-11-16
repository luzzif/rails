import styled, { css } from "styled-components";
import web3JsIcon from "../../images/web3js.svg";
import walletConnectIcon from "../../images/wallet-connect.svg";
import authereumIcon from "../../images/authereum.svg";

export const icon = css`
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    display: block;
    height: 36px;
    width: 36px;
    margin: 0 15px 0 0;
`;

export const Web3JsIcon = styled.span`
    ${icon}
    background-image: url('${web3JsIcon}');
`;

export const WalletConnectIcon = styled.span`
    ${icon}
    background-image: url('${walletConnectIcon}');
`;

export const AuthereumIcon = styled.span`
    ${icon}
    background-image: url('${authereumIcon}');
`;
