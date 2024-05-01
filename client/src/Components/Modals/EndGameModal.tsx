import React, {FC} from 'react';
import Modal from "./Modal";
import "../../Resources/Styles/EndGameModal.css"
import {useNavigate} from "react-router-dom";
import GameState from "../../Store/GameState";

interface EndGameModalProps {
    modalActive: boolean;
    setModalActive: (bool: boolean) => void;
}

const EndGameModal: FC<EndGameModalProps> = ({modalActive, setModalActive}) => {

    const navigate = useNavigate();

    const modalText = () => {
        if (GameState._isDraw)
            return <h3 className="endText win">The game ended with a draw!</h3>
        else if (GameState._winner === GameState._color)
            return <h3 className="endText win">You won!</h3>
        else
            return <h3 className="endText lose">You lose!</h3>
    }

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={true}>
            <div className={"endContainer"}>
                {modalText()}
                <div className="endButtons">
                    <button onClick={() =>navigate(`/`)} className="endLeave">Leave</button>
                    <button onClick={() => setModalActive(false)} className="endClose">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default EndGameModal;