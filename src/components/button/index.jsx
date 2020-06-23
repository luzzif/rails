import React from "react";
import styled, { css } from "styled-components";
import { UndecoratedLink } from "../undecorated-link";

const commonsStyles = css`
    display: flex;
    white-space: nowrap;
    padding: ${(props) => (props.secondary ? "13px 21px" : "16px 24px")};
    justify-content: center;
    font-size: 20px;
    font-family: "Montserrat";
    background: ${(props) => (props.secondary ? "none" : props.theme.primary)};
    color: ${(props) => (props.secondary ? "#fe2479" : "#fff")};
    border: ${(props) =>
        props.secondary ? `solid 3px ${props.theme.primary}` : "none"};
    border-radius: 24px;
    font-weight: 700;
    transition: all 0.2s ease;
    box-shadow: ${(props) =>
        props.secondary ? "none" : `0px 5px 21px 0px ${props.theme.shadow}`};
    transform: scale(1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    :hover:not(:disabled):not(:active) {
        box-shadow: ${(props) =>
            props.secondary
                ? "none"
                : `0px 10px 26px 0px ${props.theme.shadow}`};
    }
    :hover:not(:disabled) {
        ${(props) =>
            props.secondary &&
            css`
                background: rgba(254, 36, 121, 0.1);
            `}
    }
    :active {
        transform: scale(0.9);
        ${(props) =>
            !props.secondary &&
            css`
                box-shadow: ${props.secondary
                    ? "none"
                    : `0px 2px 10px 0px ${props.theme.shadow}`};
            `}
    }
    :disabled {
        cursor: not-allowed;
        background: ${(props) => (props.secondary ? "none" : "grey")};
        box-shadow: ${(props) =>
            props.secondary ? "none" : `0px 2px 8px 0px ${props.theme.shadow}`};
        ${(props) =>
            props.secondary &&
            css`
                border: solid 3px grey;
                color: grey;
            `}
    }
`;

const StyledButton = styled.button`
    ${commonsStyles}
`;

const StyledLink = styled(UndecoratedLink)`
    ${commonsStyles}
`;

export const Button = ({ link, children, href, external, ...rest }) =>
    link ? (
        <StyledLink
            href={href}
            target={external ? "_blank" : ""}
            rel="noopener noreferrer"
            {...rest}
        >
            {children}
        </StyledLink>
    ) : (
        <StyledButton {...rest}>{children}</StyledButton>
    );
