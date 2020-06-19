import styled from "styled-components";

export const StyledInput = styled.input`
    width: 100%;
    height: 48px;
    font-size: 20px;
    background: ${(props) =>
        props.dark ? props.theme.background : props.theme.foreground};
    color: ${(props) => props.theme.text};
    font-family: Montserrat;
    outline: none;
    box-sizing: border-box;
    border-radius: 24px;
    padding-left: 20px;
    padding-right: 20px;
    /* TODO: remove this nested ternary */
    border: solid 1px
        ${(props) =>
            props.error
                ? props.theme.error
                : props.dark
                ? props.theme.background
                : props.theme.foreground};
    ::placeholder {
        color: ${(props) => props.theme.placeholder};
    }
`;

export const Label = styled.div`
    color: ${(props) => props.theme.text};
    font-size: 20px;
    font-weight: 700;
`;
