import React, {FC, useEffect, useRef, useState} from 'react';
import {Colors} from "../Models/Colors";
import GameState from "../Store/GameState";
import gameState from "../Store/GameState";

interface TimerProps {
    curMove: Colors | null;
}

const Timer: FC<TimerProps> = ({curMove}) => {
    const [blackTime, setBlackTime] = useState(10);
    const [whiteTime, setWhiteTime] = useState(10);
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
            if (newTime <= 0) {
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
            if (newTime <= 0) {
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
        <div>
            <h2>black - {blackTime}</h2>
            <h2>white - {whiteTime}</h2>
        </div>
    );
};

export default Timer;