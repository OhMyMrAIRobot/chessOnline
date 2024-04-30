import axios from "axios";

export const ValidateGameHandler = (id?: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:8080/getGame?id=${id}`)
            .then((response) => {
                resolve(true)
            })
            .catch(() => {
                reject('No game with such id')
            })
    })
}