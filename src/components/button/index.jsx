import React from "react";
import styled, { css } from "styled-components";
import { UndecoratedLink } from "../undecorated-link";

const commonsStyles = css`
    display: flex;
    white-space: nowrap;
    padding: ${(props) => (props.secondary ? "9px 17px" : "12px 20px")};
    justify-content: center;
    font-size: 20px;
    font-family: "Montserrat";
    background: ${(props) => (props.secondary ? "none" : props.theme.primary)};
    color: ${(props) => (props.secondary ? props.theme.primary : "#fff")};
    border: ${(props) =>
        props.secondary ? `solid 3px ${props.theme.primary}` : "none"};
    border-radius: 24px;
    font-weight: 600;
    transition: all 0.3s ease;
    transform: scale(1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    :hover:not(:disabled) {
        ${(props) =>
            props.secondary &&
            css`
                background: rgba(33, 84, 84, 0.2);
            `}
    }
    :active {
        transform: scale(0.95);
    }
    :disabled {
        cursor: not-allowed;
        background: ${(props) => (props.secondary ? "none" : "grey")};
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
