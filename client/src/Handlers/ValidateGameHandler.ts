import axios from "axios";

export const ValidateGameHandler = async (id?: string): Promise<boolean> => {
    try {
        const response = await axios.get(`http://localhost:8080/getGame?id=${id}`);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}