import React, {FC, useRef} from 'react';
import Modal from "./Modal";
import "../../resources/styles/JoinModal.css"
import {ValidateGameHandler} from "../../handlers/ValidateGameHandler";

interface JoinModal {
    modalActive: boolean;
    setModalActive: (bool: boolean) => void;
    jumpToGame: (color: string, id: string) => void;
}

const JoinModal: FC<JoinModal> = ({modalActive, setModalActive, jumpToGame}) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const joinGame = async () => {
        if (inputRef.current) {
            const isValid = await ValidateGameHandler(inputRef.current.value);
            isValid ?
                jumpToGame('Black', inputRef.current.value)
                :
                inputRef.current.style.borderColor = 'red';
        }
    }

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={true}>
            <div onKeyDown={e => {
                     if (e.key === 'Enter') joinGame()
                     else if (e.key === 'Escape') setModalActive(false)
                 }}
            >
                <p className = "text">Enter game's ID:</p>
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
                    <button className = "button join" onClick={() => joinGame()}>Join</button>
                </div>

            </div>
        </Modal>
    );
};

export default JoinModal;