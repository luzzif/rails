import React, { useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Overlay, Container } from "./styled";

export const BottomUpContainer = ({ open, onClose, children, ...rest }) => {
    const container = useRef(null);

    const handleClick = useCallback(
        (event) => {
            if (container.current.contains(event.target)) {
                return;
            }
            onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("mousedown", handleClick);
            return () => {
                document.removeEventListener("mousedown", handleClick);
            };
        }
    }, [handleClick, open]);

    return (
        <>
            <Overlay open={open} />
            <Container
                width={["95%", "75%", "65%", "45%"]}
                open={open}
                ref={container}
                m="0 auto"
                {...rest}
            >
                {children}
            </Container>
        </>
    );
};

BottomUpContainer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};
