import React, {FC} from 'react';
import "../Resources/Styles/Game.css"
import GameState from "../Store/GameState";
import {Colors} from "../Models/Colors";

interface SideBar {
    curMove: Colors | null,
}

const SideBar: FC<SideBar> = ({curMove}) => {
    return (
        <div className="sidebar">
            <h3 className={GameState._color === curMove ? 'green' : 'red'}
            >{GameState._color === curMove ? 'Your move' : curMove === null ? 'Waiting for opponent': 'Opponent move'}</h3>
        </div>
    );
};

export default SideBar;