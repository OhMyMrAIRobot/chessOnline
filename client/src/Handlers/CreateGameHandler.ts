import axios from "axios";

export const CreateGameHandler = (): Promise<any> => {
    const id = (+ new Date).toString(16);
    return axios.post('http://localhost:8080/createGame', {id: id});
}