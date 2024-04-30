import React, {useState} from 'react';
import "../Resources/Styles/Welcome.css"
import {useNavigate} from "react-router-dom";
import JoinModal from "../Components/modals/JoinModal";
import {CreateGameHandler} from "../Handlers/CreateGameHandler";

const WelcomePage = () => {

    const navigate = useNavigate();

    const [modalActive, setModalActive] = useState<boolean>(false);

    const jumpToGame = (color: string, id: string) => {
        navigate(`/${color}/${id}`);
    }

    const createGame = async () => {
        CreateGameHandler()
            .then((id) => {
                jumpToGame('White', id);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    return (

        <div className="welcomeContainer">
            <JoinModal modalActive={modalActive} setModalActive={setModalActive} jumpToGame={jumpToGame}/>

            <button
                onClick={() => createGame()}
                className="welcomeButton"
            >
                Create game
            </button>

            <button
                className="welcomeButton"
                onClick={() => setModalActive(true)}
            >
                Join game
            </button>
        </div>
    );
};

export default WelcomePage;