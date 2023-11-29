import axios from "axios";

const Api = axios.create({
    baseURL: "http://10.30.34.178:3333",
    headers: {
        Accept: 'application/json',
        Content: 'application/json'
    }
})


export default Api;