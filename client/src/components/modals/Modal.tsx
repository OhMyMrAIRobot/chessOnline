import React, {FC} from 'react';
import "../../resources/styles/Modal.css"

interface Modal {
    active: boolean;
    setActive: (bool: boolean) => void;
    children: any;
    canClose: boolean;
}

const Modal: FC<Modal> = ({active, setActive, children, canClose}) => {
    return (
        <div
            className = {active ? "modal modalActive" : "modal"}
            onClick={e => canClose ? setActive(false) : setActive(true)}
        >
            <div
                className = {active ? "modalContent modalContentActive" : "modalContent"}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;