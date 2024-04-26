import React, {FC, useEffect, useRef} from 'react';
import Modal from "./Modal";
import "../resources/styles/JoinModal.css"
import {JoinGameHandler} from "../handlers/JoinGameHandler";

interface JoinModal {
    modalActive: boolean;
    setModalActive: (bool: boolean) => void;
    jumpToGame: (color: string, id: string) => void;
}

const JoinModal: FC<JoinModal> = ({modalActive, setModalActive, jumpToGame}) => {

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={true}>
            <div onKeyDown={e => {
                     if (e.key === 'Enter') JoinGameHandler(jumpToGame, inputRef.current)
                     else if (e.key === 'Escape') setModalActive(false)
                 }}
            >
                <p className = "text">Enter room's ID:</p>
                <input
                    placeholder = "Enter"
                    onChange={(e) => {
                        if (inputRef.current)
                            e.target.value !== '' ?
                                inputRef.current.style.borderColor = "green"
                                :
                                inputRef.current.style.borderColor = "red"
                    }}
                    className = "input" ref = {inputRef} type = 'text'
                />

                <div className={"buttonContainer"}>
                    <button className = "button exit" onClick={e => setModalActive(false)}>Cancel</button>
                    <button className = "button join" onClick={() => {JoinGameHandler(jumpToGame, inputRef.current)}}>Join</button>
                </div>

            </div>
        </Modal>
    );
};

export default JoinModal;