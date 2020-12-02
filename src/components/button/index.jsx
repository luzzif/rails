import React from "react";
import styled, { css } from "styled-components";
import { UndecoratedLink } from "../undecorated-link";

const commonsStyles = css`
    display: flex;
    height: ${(props) => (props.small ? "32px" : "40px")};
    padding: 0 16px;
    white-space: nowrap;
    justify-content: center;
    align-items: center;
    font-size: ${(props) => (props.small ? "14px" : "16px")};
    font-family: "Montserrat";
    background: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.textInverted};
    border: none;
    border-radius: 24px;
    font-weight: 600;
    transition: all 0.3s ease;
    transform: scale(1);
    outline: none;
    cursor: pointer;
    text-decoration: none;
    :active {
        transform: scale(0.95);
    }
    :disabled {
        cursor: not-allowed;
        background: ${(props) => props.theme.disabled};
        color: ${(props) => props.theme.textDisabled};
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
