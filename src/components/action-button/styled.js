import { Box } from "reflexbox";
import styled, { css } from "styled-components";

export const RootButton = styled.button`
    background: rgba(0, 0, 0, 0);
    outline: none;
    border: none;
    padding: 0;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const OuterCircle = styled(Box)`
    border-radius: 50%;
    background: ${(props) => {
        if (props.disabled) {
            return props.theme.disabled;
        }
        return props.dark ? props.theme.background : props.theme.foreground;
    }};
    transition: background 0.3s ease, transform 0.3s ease;
    color: ${(props) => props.theme.text};
    :active {
        ${(props) =>
            !props.disabled &&
            css`
                transform: scale(0.95);
            `};
    }
`;

export const IconContainer = styled.div`
    font-size: ${(props) => props.faIconSize}px;
    width: ${(props) => props.faIconSize}px;
    height: ${(props) => props.faIconSize}px;
    color: ${(props) => props.theme.text};
    transition: color 0.3s ease;
`;

export const Title = styled(Box)`
    color: ${(props) => props.theme.text};
    transition: color 0.3s ease;
    font-family: "Montserrat";
`;
