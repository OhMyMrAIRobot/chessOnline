import React, {FC} from 'react';
import Modal from "./Modal";
import "../../Resources/Styles/EndGameModal.css"
import {useNavigate} from "react-router-dom";

interface EndGameModal {
    modalActive: boolean;
    setModalActive: (bool: boolean) => void;
    isWin: boolean;
}

const EndGameModal: FC<EndGameModal> = ({modalActive, setModalActive, isWin}) => {

    const navigate = useNavigate();

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={true}>
            <div className={"endContainer"}>
                {isWin ?
                    <p className="endText win">You win!</p>
                    :
                    <p className="endText lose">You lose!</p>
                }
                <div className="endButtons">
                    <button onClick={() =>navigate(`/`)} className="endLeave">Leave</button>
                    <button onClick={() => setModalActive(false)} className="endClose">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default EndGameModal;