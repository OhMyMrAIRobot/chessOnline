import React, {FC} from 'react';
import Modal from "./Modal";
import "../../Resources/Styles/OfferDrawModal.css"
import {SendMessage} from "../../Handlers/SendMessage";
import GameState from "../../Store/GameState";

interface OfferDrawModalProps {
    modalActive: boolean;
    setModalActive: (bool: boolean) => void;
}

const OfferDrawModal: FC<OfferDrawModalProps> = ({modalActive, setModalActive}) => {

    const agreeDraw = () => {
        SendMessage(GameState._socket, {
            method: 'agreeDraw',
            id: GameState._session,
            color: GameState._color,
        })
        setModalActive(false);
    }

    const rejectDraw = () => {
        SendMessage(GameState._socket, {
            method: 'rejectDraw',
            id: GameState._session,
            color: GameState._color,
        })
        setModalActive(false);
    }

    return (
        <Modal active={modalActive} setActive={setModalActive} canClose={false}>
            <div className="drawContainer">
                <h3>Opponent offers a draw</h3>
                <div className="drawButtons">
                    <button
                        className="drawButton drawAgree"
                        onClick={() => agreeDraw()}
                    >Agree</button>

                    <button
                        className="drawButton drawReject"
                        onClick={() => rejectDraw()}
                    >Reject</button>
                </div>
            </div>

        </Modal>
    );
};

export default OfferDrawModal;