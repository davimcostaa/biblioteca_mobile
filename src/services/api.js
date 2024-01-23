import axios from "axios";

const Api = axios.create({
    baseURL: "http://192.168.1.134:3333",
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})


export default Api;

