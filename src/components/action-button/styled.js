import { Box } from "reflexbox";
import styled from "styled-components";

export const RootButton = styled.button`
    background: rgba(0, 0, 0, 0);
    outline: none;
    border: none;
    padding: 0;
    cursor: pointer;
`;

export const OuterCircle = styled(Box)`
    border-radius: 50%;
    background: ${(props) =>
        props.dark ? props.theme.background : props.theme.foreground};
    color: ${(props) => props.theme.text};
`;

export const IconContainer = styled.div`
    font-size: ${(props) => props.faIconSize}px;
    width: ${(props) => props.faIconSize}px;
    height: ${(props) => props.faIconSize}px;
`;

export const Title = styled(Box)`
    color: ${(props) => props.theme.text};
    font-family: "Montserrat";
`;
