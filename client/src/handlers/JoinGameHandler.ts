import axios from "axios";

export const JoinGameHandler = (jumpToGame: (color: string, id: string) => void, input: any) => {
    const id = input.value === undefined ? -1 : input.value;
    axios.get(`http://localhost:8080/getGame?id=${id}`)
        .then(response => {
            if (response.status === 200) {
                jumpToGame('Black', id);
            }
        })
        .catch(error => {

        });
};