import styled from "styled-components";
import { Box } from "reflexbox";
import { Button } from "../../components/button";

export const LoginIllustration = styled.img`
    width: 100%;
`;

export const WelcomeTextBox = styled(Box)`
    font-size: 20px;
    font-weight: 700;
    text-align: center;
`;

export const InvalidChainText = styled.span`
    color: ${(props) => props.theme.error};
`;

export const FullWidthButton = styled(Button)`
    width: 100%;
`;
