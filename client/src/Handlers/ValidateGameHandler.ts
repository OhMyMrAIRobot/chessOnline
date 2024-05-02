import axios from "axios";

export const ValidateGameHandler = (id?: string): Promise<boolean> => {
    return axios.get(`http://localhost:8080/getGame?id=${id}`);
}