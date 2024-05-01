import React, {FC, useEffect, useRef, useState} from 'react';
import {Colors} from "../Models/Colors";
import GameState from "../Store/GameState";
import timerImg from "../Resources/Images/timer.png"
import "../Resources/Styles/SideBar.css"

interface TimerProps {
    curMove: Colors | null;
}

const Timer: FC<TimerProps> = ({curMove}) => {
    const [blackTime, setBlackTime] = useState(300);
    const [whiteTime, setWhiteTime] = useState(300);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        if (curMove)
            startTimer()
    }, [curMove]);

    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current)
        }
        const callback = curMove === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
        timer.current = setInterval(callback, 1000);
    }

    function decrementBlackTimer() {
        setBlackTime(prevState => {
            const newTime = prevState - 1;
            if (newTime <= 0 || GameState._winner) {
                if (timer.current)
                    clearInterval(timer.current);
                return newTime;
            }
            return newTime;
        });
    }

    function decrementWhiteTimer() {
        setWhiteTime(prevState => {
            const newTime = prevState - 1;
            if (newTime <= 0 || GameState._winner) {
                if (timer.current)
                    clearInterval(timer.current);
                return newTime;
            }
            return newTime;
        });
    }

    useEffect(() => {
        if (blackTime <= 0) {
            GameState.setWinner(Colors.WHITE);
        } else if (whiteTime <= 0) {
            GameState.setWinner(Colors.BLACK);
        }
    }, [blackTime, whiteTime]);

    return (
        <div className={"timerContainer"}>
            <div className={"timerItem"}>
                <img src={timerImg} alt={'timer'} className={"timerImg"}/>
                <h2>Black: {Math.floor(blackTime / 60)}:{(blackTime % 60).toString().padStart(2, '0')}</h2>
            </div>
            <div className={"timerItem"}>
                <img src={timerImg} alt={'timer'} className={"timerImg"}/>
                <h2>White: {Math.floor(whiteTime / 60)}:{(whiteTime % 60).toString().padStart(2, '0')}</h2>
            </div>


        </div>
    );
};

export default Timer;