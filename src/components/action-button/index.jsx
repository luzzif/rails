import React from "react";
import PropTypes from "prop-types";
import { Flex } from "reflexbox";
import { OuterCircle, Title, RootButton, Icon } from "./styled";

export const ActionButton = ({
    faIcon,
    faIconSize,
    title,
    size,
    dark,
    ...rest
}) => (
    <RootButton {...rest}>
        <Flex flexDirection="column" alignItems="center">
            <OuterCircle
                mb={2}
                width={size}
                height={size}
                display="flex"
                justifyContent="center"
                alignItems="center"
                dark={dark}
            >
                <Icon icon={faIcon} faIconSize={faIconSize} />
            </OuterCircle>
            {title && <Title fontSize={[12, 16]}>{title}</Title>}
        </Flex>
    </RootButton>
);

ActionButton.propTypes = {
    faIcon: PropTypes.node.isRequired,
    faIconSize: PropTypes.number.isRequired,
    title: PropTypes.node,
    size: PropTypes.oneOf([PropTypes.number, PropTypes.array]).isRequired,
    dark: PropTypes.bool,
};
