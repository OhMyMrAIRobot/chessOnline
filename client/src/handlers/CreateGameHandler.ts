import axios from "axios";

export const CreateRoomHandler = (jumpToGame: (color: string, id: string) => void) => {
    const id = (+ new Date).toString(16)
    axios.post(`http://localhost:8080/createGame?id=${id}`).then(response =>
        response.status === 200 ? jumpToGame('White', id) : console.log('error'))
}