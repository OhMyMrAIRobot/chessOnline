import React, {useEffect, useRef} from 'react';
// import '../Style/Chat.css'
// import {useParams} from "react-router-dom";
// import {sendMessage} from "../handlers/sendMessage";
//
// const ChangeFormat =(min) => {
//     if (min < 10)
//         return `0${min}`
//     else
//         return min
// }
//
// // Сообщение от пользователя
// const CreateMessage = (message, username: string, chatContainer) => {
//     let messageElement = document.createElement('div');
//     message.user === username ? messageElement.className = "msg author" : messageElement.className = "msg"
//     chatContainer.appendChild(messageElement);
//
//     let messageHeader = document.createElement('div');
//     messageHeader.className = "msg_header";
//     messageElement.appendChild(messageHeader);
//
//     let authorSpan = document.createElement('span');
//     authorSpan.className = "msg_author";
//     message.user === username ? authorSpan.textContent = "You" : authorSpan.textContent = message.user;
//     messageHeader.appendChild(authorSpan);
//
//     let timeSpan = document.createElement('span');
//     timeSpan.className = "msg_time";
//     timeSpan.textContent = message.time.hour + ":" + ChangeFormat(message.time.minute);
//     messageHeader.appendChild(timeSpan);
//
//     let messageText = document.createElement('div');
//     messageText.className = "msg_text";
//     messageText.textContent =  message.text;
//     messageElement.appendChild(messageText);
// }
//
// // Системное сообщение
// const ConnectionMessage = (message, username, chatContainer) => {
//     let messageElement = document.createElement('div');
//     messageElement.className = "msg_connect_container";
//     chatContainer.appendChild(messageElement);
//
//     let nameSpan = document.createElement('span');
//     nameSpan.className = "msg_connect";
//     message.type === 'connect' ?
//         nameSpan.textContent = `User ${message.user} has connected!`
//         :
//         nameSpan.textContent = `User ${message.user} disconnected!`
//     ;
//     messageElement.appendChild(nameSpan);
// }
//
// const Chat = ({socket, username, msgArray, chatActive}) => {
//
//     const inputRef = useRef("")
//     const chatRef = useRef("")
//     const params = useParams();
//
//     // обновление сообщений
//     useEffect(() => {
//
//         // Новое сообщение
//         if (!chatActive)
//             document.getElementById('idMsgSpan').style.opacity = '1';
//
//         // Отрисовка сообщений
//         let chatContainer = document.getElementById('idchat');
//         chatContainer.innerHTML = '';
//
//         msgArray.forEach(function (message) {
//             if (message.type === "message")
//                 CreateMessage(message, username, chatContainer);
//             else
//                 ConnectionMessage(message, username, chatContainer);
//         });
//
//         chatContainer.scrollTop = chatContainer.scrollHeight;
//     }, [msgArray]);
//
//     // Отправка сообщения
//     const sendMessageHandler = () => {
//         let currentDate = new Date();
//         let currentHour = currentDate.getHours();
//         let currentMinute = currentDate.getMinutes();
//         sendMessage(canvasState.socket,{id: params.id, method: 'message', username: username, data: inputRef.current.value, time: {hour: currentHour, minute: currentMinute}})
//         inputRef.current.value = "";
//     }
//
//     return (
//             <div
//                 ref = {chatRef}
//                 onKeyDown={e => {if (e.key === 'Enter' && inputRef.current.value !== "") sendMessageHandler()}}
//                 className = {chatActive ? "chat chat_active" : "chat"}>
//                 <div className = "msg_container" id = "idchat"></div>
//                 <div className = "send_container">
//                     <input placeholder = "Enter" className = "msg_input" ref = {inputRef} type = 'text'></input>
//                     <button
//                         onClick={() => {sendMessageHandler()}}
//                         className = "send_button">Send</button>
//                 </div>
//             </div>
//     );
// };
//
// export default Chat;