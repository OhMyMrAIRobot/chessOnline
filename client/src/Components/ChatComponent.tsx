import React, {FC, useEffect, useRef} from 'react';
import '../Resources/Styles/Chat.css'
import GameState from "../Store/GameState";
import {SendMessage} from "../Handlers/SendMessage";
import gameState from "../Store/GameState";

const ChangeFormat =(min: number):string => {
    if (min < 10)
        return `0${min}`
    else
        return min.toString()
}

// Сообщение от пользователя
const CreateMessage = (message: any, chatContainer: HTMLElement) => {
    let messageElement = document.createElement('div');
    message.user === GameState._username ? messageElement.className = "msg author" : messageElement.className = "msg"
    chatContainer.appendChild(messageElement);

    let messageHeader = document.createElement('div');
    messageHeader.className = "msgHeader";
    messageElement.appendChild(messageHeader);

    let authorSpan = document.createElement('span');
    authorSpan.className = "msgAuthor";
    message.user === GameState._username ? authorSpan.textContent = "You" : authorSpan.textContent = message.user;
    messageHeader.appendChild(authorSpan);

    let timeSpan = document.createElement('span');
    timeSpan.className = "msgTime";
    timeSpan.textContent = message.time.hour + ":" + ChangeFormat(message.time.minute);
    messageHeader.appendChild(timeSpan);

    let messageText = document.createElement('div');
    messageText.className = "msgText";
    messageText.textContent =  message.text;
    messageElement.appendChild(messageText);
}

// Системное сообщение
const CreateSystemMessage = (message: any, chatContainer: HTMLElement) => {
    let messageElement = document.createElement('div');
    messageElement.className = "msgConnectContainer";
    chatContainer.appendChild(messageElement);

    let nameSpan = document.createElement('span');
    nameSpan.className = "msgConnect";
    switch (message.type) {
        case 'connect' :
            nameSpan.textContent = `User ${message.user} has connected!`;
            break;
        case 'offerDraw':
            nameSpan.textContent = `${message.color === GameState._color ? "You offered a draw!" : "The opponent offered a draw!"}`;
            break;
        case 'agreeDraw':
            nameSpan.textContent = `The game ended in a draw!`;
            break
        case 'rejectDraw':
            nameSpan.textContent = `${message.color === GameState._color ? "You rejected a draw!" : "The opponent rejected a draw!"}`;
            break;
        case 'win':
            nameSpan.textContent = `${message.color === GameState._winner ? "You won!" : "You lose!"}`;
            break
        case 'giveUp':
            nameSpan.textContent = `${message.color === GameState._color ? "You gave up!" : "The opponent gave up!"}`;
            break;

    }
    messageElement.appendChild(nameSpan);
}

interface ChatProps {
    msgArray: any[];
}

const Chat:FC<ChatProps> = ({msgArray}) => {

    const chatContainer: HTMLElement | null = document.getElementById('Chat');
    const inputRef = useRef<HTMLInputElement | null>(null)
    const chatRef = useRef<HTMLDivElement | null>(null)

    // обновление сообщений
    useEffect(() => {
        if (chatContainer) {
            if (chatContainer) chatContainer.innerHTML = '';
            msgArray.forEach((message) => {
                if (message.type === 'message')
                    CreateMessage(message, chatContainer);
                else
                    CreateSystemMessage(message, chatContainer);
            });

            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [msgArray]);

    // Отправка сообщения
    const sendMessageHandler = () => {
        let currentDate = new Date();
        let currentHour = currentDate.getHours();
        let currentMinute = currentDate.getMinutes();
        if (inputRef.current) {
            SendMessage(GameState._socket,
                {method: 'message',
                    id: GameState._session,
                    username: gameState._username,
                    data: inputRef.current.value,
                    time: {hour: currentHour, minute: currentMinute}
                })
            inputRef.current.value = "";
        }
    }

    return (
        <div
            ref={chatRef}
            onKeyDown={e => {
                if (e.key === 'Enter' && inputRef.current && inputRef.current.value !== "") sendMessageHandler()
            }}
            className="chat">
            <div className="msgContainer" id="Chat"></div>
            <div className="sendContainer">
                <input placeholder="Enter" className="msgInput" ref={inputRef} type='text'></input>
                <button
                    onClick={() => {
                        sendMessageHandler()
                    }}
                    className="sendButton">Send
                </button>
            </div>
        </div>
    );
};

export default Chat;