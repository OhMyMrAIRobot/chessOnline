import axios from "axios";

export const CreateGameHandler = async (): Promise<string | null> => {
    const id = (+ new Date).toString(16)
    try {
        const response = await axios.post(`http://localhost:8080/createGame?id=${id}`);
        return response.status === 200 ? id : null;
    } catch (error) {
        return null;
    }
}