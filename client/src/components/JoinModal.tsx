import React, {FC, useEffect} from 'react';
import Modal from "./Modal";
import "../resourses/styles/JoinModal.css"

interface JoinModal {
    modalActive: boolean;
    setModalActive: (bool: boolean) => void;
    inputRef: any;
    jumpToRoom: (color: string, id: string) => void;
}

const JoinModal: FC<JoinModal> = ({modalActive, setModalActive, inputRef, jumpToRoom}) => {

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [modalActive]);

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={true}>
            <div onKeyDown={e => {
                     if (e.key === 'Enter') {}
                     else if (e.key === 'Escape') setModalActive(false)
                 }}
            >
                <p className = "text">Enter room's ID:</p>
                <input
                    placeholder = "Enter"
                    onChange={(e) => {
                        e.target.value !== '' ?
                            inputRef.current.style.borderColor = "green"
                            :
                            inputRef.current.style.borderColor = "red"
                    }}
                    className = "input" ref = {inputRef} type = 'text'
                />

                <div className={"buttonContainer"}>
                    <button className = "button exit" onClick={e => setModalActive(false)}>Cancel</button>
                    <button className = "button join" onClick={() => {}}>Join</button>
                </div>

            </div>
        </Modal>
    );
};

export default JoinModal;