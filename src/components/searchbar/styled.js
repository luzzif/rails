import styled from "styled-components";
import { Flex } from "reflexbox";

export const SearchbarContainer = styled(Flex)`
    background: ${(props) =>
        props.dark ? props.theme.background : props.theme.foreground};
    border-radius: 24px;
    transition: background 0.3s ease;
`;

export const SearchIconContainer = styled.div`
    font-size: 20px;
`;

export const Input = styled.input`
    width: 100%;
    height: 100%;
    border: none;
    font-size: 20px;
    background: ${(props) =>
        props.dark ? props.theme.background : props.theme.foreground};
    color: ${(props) => props.theme.text};
    font-family: Montserrat;
    outline: none;
    transition: color 0.3s ease, background 0.3s ease;
    ::placeholder {
        transition: color 0.3s ease;
        color: ${(props) => props.theme.placeholder};
    }
`;
