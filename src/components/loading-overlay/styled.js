import styled, { css } from "styled-components";
import { Flex } from "reflexbox";

export const OverlayFlex = styled(Flex)`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${(props) =>
        props.light ? props.theme.foreground : props.theme.background};
    opacity: 1;
    color: ${(props) => props.theme.primary};
    border-radius: 24px;
    transition: opacity 0.3s ease;
    font-size: 52px;
    ${(props) =>
        !props.open &&
        css`
            opacity: 0;
            pointer-events: none;
        `}
`;
