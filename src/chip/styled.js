import styled from "styled-components";
import { Flex } from "reflexbox";

export const Container = styled(Flex)`
    font-family: Montserrat;
    outline: none;
    padding: 8px 16px;
    color: ${(props) => (props.active ? "#fff" : props.theme.text)};
    border-radius: 24px;
    background: ${(props) => {
        if (props.active) {
            return props.theme.primary;
        }
        return props.dark ? props.theme.background : props.theme.foreground;
    }};
    font-size: 16px;
    transition: background 0.3s ease, color 0.3s ease;
    cursor: pointer;
`;
