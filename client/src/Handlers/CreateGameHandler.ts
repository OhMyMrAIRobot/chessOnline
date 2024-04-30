import axios from "axios";

export const CreateGameHandler = (): Promise<string> => {
    const id = (+ new Date).toString(16);
    return new Promise<string>((resolve, reject) => {
        axios.post('http://localhost:8080/createGame', {id: id})
            .then((res) => {
                resolve(id);
            })
            .catch(() => {
                reject('something went wrong');
            })
    })
}