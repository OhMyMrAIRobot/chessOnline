import React, {FC, useRef} from 'react';
import Modal from "./Modal";
import GameState from "../../store/GameState";
import "../../resources/styles/UsernameModal.css"
import {SendMessage} from "../../handlers/SendMessage";
import {useParams} from "react-router-dom";

interface UsernameModal {
    modalActive: boolean;
    setModalActive: (bool: boolean) => void;
}

const UsernameModal: FC<UsernameModal> = ({modalActive, setModalActive}) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const params = useParams()

    const setUsername = () => {
        if (inputRef.current) {
            const username = inputRef.current.value
            if (username !== "") {
                GameState.setUsername(username);
                setModalActive(false);
                SendMessage(GameState._socket, {method: 'connection', id: params.id, username: username, color: params.color});
            } else {
                inputRef.current.style.borderColor = "red";
            }
        }
    }

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={false}>
            <div className={"container"}
                onKeyDown={e => {
                if (e.key === 'Enter') setUsername()
            }}
            >
                <p className="title">Your username:</p>
                <input
                    placeholder="Enter"
                    onChange={(e) => {
                        if (inputRef.current)
                            e.target.value !== '' ?
                                inputRef.current.style.borderColor = "green"
                                :
                                inputRef.current.style.borderColor = "red"
                    }}
                    className="inputName" ref={inputRef} type='text'
                />

                <button className="buttonEnter" onClick={() => setUsername()}>Enter</button>

            </div>
        </Modal>
    );
};

export default UsernameModal;