import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "./Pages/WelcomePage";
import GamePage from "./Pages/GamePage";

const App: React.FC = () => {

    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element = {<WelcomePage />}/>
                    <Route path={"/:id"} element = {<GamePage />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
