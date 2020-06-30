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
    ...rest
}) => (
    <RootButton {...rest}>
        <Flex flexDirection="column" alignItems="center">
            <OuterCircle
                width={size}
                height={size}
                display="flex"
                justifyContent="center"
                alignItems="center"
                dark={dark}
            >
                <IconContainer faIconSize={faIconSize}>
                    <FontAwesomeIcon icon={faIcon} />
                </IconContainer>
            </OuterCircle>
            {title && <Title mt={2} fontSize={[12, 16]}>{title}</Title>}
        </Flex>
    </RootButton>
);

ActionButton.propTypes = {
    faIcon: PropTypes.object.isRequired,
    faIconSize: PropTypes.number.isRequired,
    title: PropTypes.node,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
    dark: PropTypes.bool,
};
