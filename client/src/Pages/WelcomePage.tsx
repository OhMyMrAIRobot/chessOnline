import React, {useRef, useState} from 'react';
import "../resourses/styles/Welcome.css"
import {useNavigate} from "react-router-dom";
import JoinModal from "../components/JoinModal";
import {CreateRoomHandler} from "../handlers/CreateGameHandler";

const WelcomePage = () => {

    const navigate = useNavigate();

    const [modalActive, setModalActive] = useState<boolean>(false);

    const inputRef = useRef()

    const jumpToGame = (color: string, id: string) => {
        navigate(`/${color}/${id}`);
    }

    return (

        <div className="welcomeContainer">
            <JoinModal inputRef={inputRef} modalActive={modalActive} setModalActive={setModalActive} jumpToRoom={jumpToGame}/>

            <button
                onClick={() => CreateRoomHandler(jumpToGame)}
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