import styled, { css } from "styled-components";
import metamaskIcon from "../../images/metamask.svg";
import walletConnectIcon from "../../images/wallet-connect.svg";
import authereumIcon from "../../images/authereum.svg";
import { Box } from "reflexbox";

export const icon = css`
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    display: block;
    height: 36px;
    width: 36px;
    margin: 0 15px 0 0;
`;

export const MetamaskIcon = styled.span`
    ${icon}
    background-image: url('${metamaskIcon}');
`;

export const WalletConnectIcon = styled.span`
    ${icon}
    background-image: url('${walletConnectIcon}');
`;

export const AuthereumIcon = styled.span`
    ${icon}
    background-image: url('${authereumIcon}');
`;
