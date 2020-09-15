import React from "react";
import PropTypes from "prop-types";
import { Flex } from "reflexbox";
import { OuterCircle, Title, RootButton, IconContainer } from "./styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ActionButton = ({
    faIcon,
    faIconSize,
    title,
    size,
    dark,
    disabled,
    ...rest
}) => (
    <RootButton disabled={disabled} {...rest}>
        <Flex flexDirection="column" alignItems="center">
            <OuterCircle
                width={size}
                height={size}
                display="flex"
                justifyContent="center"
                alignItems="center"
                dark={dark}
                disabled={disabled}
            >
                <IconContainer faIconSize={faIconSize}>
                    <FontAwesomeIcon icon={faIcon} />
                </IconContainer>
            </OuterCircle>
            {title && (
                <Title mt="8px" fontSize={[12, 16]}>
                    {title}
                </Title>
            )}
        </Flex>
    </RootButton>
);

ActionButton.propTypes = {
    faIcon: PropTypes.object.isRequired,
    faIconSize: PropTypes.number.isRequired,
    title: PropTypes.node,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
    dark: PropTypes.bool,
    disabled: PropTypes.bool,
};
